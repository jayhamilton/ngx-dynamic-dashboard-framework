import { Component, ElementRef, forwardRef, Input, OnDestroy, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventService } from '../../eventservice/event.service';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

declare const ace: any;

@Component({
  selector: 'custom-ace-editor',
  template: `
    <div #editor style="height: 400px; width: 100%; min-width: 600px; border: 1px solid #ccc; border-radius: 4px;">
      @if (!editorReady) {
        <div style="padding: 20px; text-align: center; color: #666;">
          Loading editor...
        </div>
      }
    </div>
    `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AceEditorComponent),
      multi: true,
    },
  ],
  standalone: false
})
export class AceEditorComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {
  @ViewChild('editor', { static: true }) editorElement!: ElementRef;
  @Input() mode = 'json';
  @Input() theme = 'github';

  private editor: any;
  private value = '';
  private onChange = (value: string) => {};
  private onTouched = () => {};
  editorReady = false;
  private destroy$ = new Subject<void>();
  private changeSubject = new Subject<string>();
  private instanceId = Math.random().toString(36).substr(2, 9);
  private pendingValue: string | null = null;

  constructor(private eventService: EventService, private cdr: ChangeDetectorRef) {
    console.log('AceEditor: Created instance', this.instanceId);
  }

  ngOnInit() {
    console.log(`AceEditor[${this.instanceId}]: ngOnInit called`);
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    // Set up debounced change emission
    this.changeSubject.pipe(
      debounceTime(300),
      takeUntil(this.destroy$)
    ).subscribe((value) => {
      console.log(`AceEditor[${this.instanceId}]: Emitting debounced change event`);
      this.eventService.emitChartDataChanged({
        data: {
          source: 'ace-editor',
          chartData: value,
          sourceInstance: this.instanceId
        }
      });
    });

    // Listen for chart data changes from other tabs
    this.eventService.listenForChartDataChangedEvent()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: any) => {
        console.log(`AceEditor[${this.instanceId}]: Received event:`, event);
        
        if (event.data && event.data.source === 'tab-change') {
          // Handle tab change events
          console.log(`AceEditor[${this.instanceId}]: Tab changed to:`, event.data.tabIndex, event.data.tabLabel);
          this.onTabActivated();
        } else if (event.data && event.data.source !== 'ace-editor' && event.data.sourceInstance !== this.instanceId) {
          console.log(`AceEditor[${this.instanceId}]: Processing chart data change from:`, event.data.source, 'sourceInstance:', event.data.sourceInstance, 'with data:', event.data.chartData);
          this.updateFromExternalSource(event.data.chartData);
        } else {
          console.log(`AceEditor[${this.instanceId}]: Ignoring event - source:`, event.data?.source, 'sourceInstance:', event.data?.sourceInstance);
        }
      });
  }

  ngAfterViewInit() {
    console.log(`AceEditor[${this.instanceId}]: ngAfterViewInit called`);
    this.loadAndInitAce();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.editor) {
      this.editor.destroy();
    }
  }

  private async loadAndInitAce() {
    try {
      console.log('Loading ACE editor...');
      
      // Check if ACE is already loaded
      if (typeof ace !== 'undefined') {
        console.log('ACE already loaded');
        this.initEditor();
        return;
      }

      // Load ACE from CDN
      await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.13/ace.min.js');
      console.log('ACE base loaded');
      
      await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.13/mode-json.min.js');
      console.log('ACE JSON mode loaded');
      
      await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.13/theme-github.min.js');
      console.log('ACE theme loaded');

      this.initEditor();
    } catch (error) {
      console.error('Failed to load ACE editor:', error);
      // Fallback to textarea
      this.showFallback();
    }
  }

  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  private initEditor() {
    try {
      console.log(`AceEditor[${this.instanceId}]: Initializing ACE editor...`);
      this.editor = ace.edit(this.editorElement.nativeElement);
      this.editor.setTheme(`ace/theme/${this.theme}`);
      this.editor.session.setMode(`ace/mode/${this.mode}`);
      this.editor.setValue(this.value || '');
      this.editor.clearSelection();
      
      // Configure editor options
      this.editor.setOptions({
        fontSize: 14,
        showPrintMargin: false,
        wrap: true,
        tabSize: 2,
        useSoftTabs: true
      });

      this.editor.on('change', () => {
        const value = this.editor.getValue();
        this.onChange(value);
        // Emit to other tabs via event system
        this.changeSubject.next(value);
      });

      this.editor.on('blur', () => {
        this.onTouched();
      });

      this.editorReady = true;
      console.log(`AceEditor[${this.instanceId}]: ACE editor initialized successfully`);
      
      // Apply any stored value that came from external sources while editor was loading
      if (this.value && this.value !== this.editor.getValue()) {
        console.log(`AceEditor[${this.instanceId}]: Applying stored value after initialization:`, this.value);
        this.editor.setValue(this.value);
        this.editor.clearSelection();
      }
    } catch (error) {
      console.error(`AceEditor[${this.instanceId}]: Failed to initialize ACE editor:`, error);
      this.showFallback();
    }
  }

  private showFallback() {
    // Show a textarea as fallback
    this.editorElement.nativeElement.innerHTML = `
      <textarea 
        style="width: 100%; height: 100%; border: none; padding: 10px; font-family: monospace; font-size: 14px;"
        placeholder="Enter JSON data here...">${this.value || ''}</textarea>
    `;
    
    const textarea = this.editorElement.nativeElement.querySelector('textarea');
    textarea.addEventListener('input', (e: any) => {
      this.onChange(e.target.value);
    });
    
    textarea.addEventListener('blur', () => {
      this.onTouched();
    });
    
    this.editorReady = true;
  }

  private updateFromExternalSource(jsonData: string) {
    console.log(`AceEditor[${this.instanceId}]: Updating from external source. Editor ready:`, this.editorReady, 'Editor exists:', !!this.editor);
    console.log(`AceEditor[${this.instanceId}]: Current value:`, this.editor?.getValue());
    console.log(`AceEditor[${this.instanceId}]: New value:`, jsonData);
    
    // Update internal value first
    this.value = jsonData;
    
    // Check if the editor container is visible (tab is active)
    const isVisible = this.isElementVisible();
    console.log(`AceEditor[${this.instanceId}]: Element visible:`, isVisible);
    
    if (this.editor && isVisible) {
      const currentValue = this.editor.getValue();
      if (currentValue !== jsonData) {
        console.log(`AceEditor[${this.instanceId}]: Setting new value in editor (visible)`);
        this.setEditorValue(jsonData);
      } else {
        console.log(`AceEditor[${this.instanceId}]: Values are the same, no update needed`);
      }
    } else if (this.editor && !isVisible) {
      // Store the value to apply when tab becomes visible
      console.log(`AceEditor[${this.instanceId}]: Tab not visible, storing pending value`);
      this.pendingValue = jsonData;
    } else if (this.editorReady) {
      console.log(`AceEditor[${this.instanceId}]: Updating fallback textarea`);
      const textarea = this.editorElement.nativeElement.querySelector('textarea');
      if (textarea && textarea.value !== jsonData) {
        textarea.value = jsonData;
        // Trigger input event to update any bound models
        const event = new Event('input', { bubbles: true });
        textarea.dispatchEvent(event);
      }
    } else {
      console.log(`AceEditor[${this.instanceId}]: Editor not ready, storing value for later`);
      this.pendingValue = jsonData;
    }
  }

  private setEditorValue(jsonData: string) {
    // Remove all change listeners temporarily to prevent infinite loops
    this.editor.removeAllListeners('change');
    
    // Set the new value using session to ensure proper refresh
    const session = this.editor.getSession();
    session.setValue(jsonData);
    this.editor.clearSelection();
    
    // Force complete visual refresh
    this.editor.resize();
    this.editor.renderer.updateFull();
    this.editor.renderer.updateText();
    session.getUndoManager().reset();
    
    // Re-attach the change listener
    this.editor.on('change', () => {
      const value = this.editor.getValue();
      this.onChange(value);
      this.changeSubject.next(value);
    });
    
    // Use setTimeout to ensure the refresh happens after the current call stack
    setTimeout(() => {
      this.editor.resize();
      this.editor.renderer.updateFull();
      this.cdr.detectChanges();
      this.cdr.markForCheck();
    }, 10);
    
    console.log(`AceEditor[${this.instanceId}]: Editor content updated and refreshed`);
    console.log(`AceEditor[${this.instanceId}]: Current display value:`, this.editor.getValue());
  }

  private isElementVisible(): boolean {
    const element = this.editorElement.nativeElement;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && window.getComputedStyle(element).visibility !== 'hidden';
  }

  @HostListener('window:focus', [])
  @HostListener('document:visibilitychange', [])
  onTabActivated() {
    // Use setTimeout to ensure DOM is ready after tab switch
    setTimeout(() => {
      // Check if there's a pending value to apply when tab becomes visible
      if (this.pendingValue && this.editor) {
        const isVisible = this.isElementVisible();
        console.log(`AceEditor[${this.instanceId}]: Tab activation check - visible:`, isVisible, 'pending value:', this.pendingValue);
        
        if (isVisible) {
          console.log(`AceEditor[${this.instanceId}]: Tab became visible, applying pending value:`, this.pendingValue);
          this.setEditorValue(this.pendingValue);
          this.pendingValue = null;
        }
      } else if (this.editor && this.isElementVisible()) {
        // Force refresh even without pending value to ensure content is visible
        console.log(`AceEditor[${this.instanceId}]: Tab visible, forcing refresh`);
        this.editor.resize();
        this.editor.renderer.updateFull();
      }
    }, 50);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    console.log(`AceEditor[${this.instanceId}]: writeValue called with:`, value);
    this.value = value || '';
    
    // Update editor if it exists and the value is different
    if (this.editor) {
      const currentValue = this.editor.getValue();
      if (currentValue !== this.value) {
        console.log(`AceEditor[${this.instanceId}]: Updating editor content`);
        this.editor.setValue(this.value);
        this.editor.clearSelection();
      }
    } else if (this.editorReady) {
      // Update fallback textarea
      const textarea = this.editorElement.nativeElement.querySelector('textarea');
      if (textarea && textarea.value !== this.value) {
        textarea.value = this.value;
      }
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.editor) {
      this.editor.setReadOnly(isDisabled);
    }
  }
}