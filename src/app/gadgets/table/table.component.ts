import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BoardService } from 'src/app/board/board.service';
import { EventService } from 'src/app/eventservice/event.service';
import { GadgetBase } from '../common/gadget-common/gadget-base/gadget.base';
import { MatCard, MatCardContent } from '@angular/material/card';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { GadgetHeaderComponent } from '../common/gadget-common/gadget-header/gadget-header.component';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, CdkDrag, GadgetHeaderComponent, MatCardContent]
})
export class TableComponent extends GadgetBase implements OnInit {
  rows: any[] = [];
  columns: string[] = [];

  showStriped: boolean = true;
  showDense: boolean = false;
  showRowNumbers: boolean = false;
  maxRows: number = 0;

  /** Explicit column list from configuration; blank means derive from data. */
  private configuredColumns: string = '';

  constructor(private eventService: EventService, private boardService: BoardService) {
    super();
  }

  ngOnInit(): void {
    this.loadTableProperties();
    this.loadTableData();
  }

  override initializeConfiguration(gadgetData: any) {
    super.initializeConfiguration(gadgetData);
    this.loadTableProperties();
    this.loadTableData();
  }

  get visibleRows(): any[] {
    return this.maxRows > 0 ? this.rows.slice(0, this.maxRows) : this.rows;
  }

  private toBool(value: any): boolean {
    return value === true || value === 'true';
  }

  private loadTableProperties(): void {
    if (!this.propertyPages) return;
    this.propertyPages.forEach((page) => {
      page.properties.forEach((property: any) => {
        switch (property.key) {
          case 'tableColumns':
            this.configuredColumns = property.value || '';
            break;
          case 'showStriped':
            this.showStriped = this.toBool(property.value);
            break;
          case 'showDense':
            this.showDense = this.toBool(property.value);
            break;
          case 'showRowNumbers':
            this.showRowNumbers = this.toBool(property.value);
            break;
          case 'maxRows':
            this.maxRows = Number(property.value) || 0;
            break;
        }
      });
    });
  }

  private loadTableData(): void {
    let found = false;
    if (this.propertyPages && this.propertyPages.length > 0) {
      this.propertyPages.forEach((page) => {
        page.properties.forEach((property: any) => {
          if (property.key === 'tableData' && property.value) {
            found = this.applyData(property.value);
          }
        });
      });
    }
    if (!found) {
      this.rows = [
        { Line: 'Line A', Output: 1240, Defects: 12, Status: 'Running' },
        { Line: 'Line B', Output: 980, Defects: 31, Status: 'Running' },
        { Line: 'Line C', Output: 0, Defects: 0, Status: 'Stopped' },
        { Line: 'Line D', Output: 1515, Defects: 4, Status: 'Running' }
      ];
      this.resolveColumns();
    }
  }

  /** Returns true when the JSON parsed into a usable row array. */
  private applyData(rawJson: string): boolean {
    try {
      const parsed = JSON.parse(rawJson);
      if (!Array.isArray(parsed)) {
        console.error('Table gadget expects a JSON array of row objects.');
        return false;
      }
      this.rows = parsed;
      this.resolveColumns();
      return true;
    } catch (error) {
      console.error('Invalid JSON data for table:', error);
      return false;
    }
  }

  private resolveColumns(): void {
    const explicit = this.configuredColumns
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);

    if (explicit.length > 0) {
      this.columns = explicit;
      return;
    }

    // Union of keys across all rows rather than just the first, so rows with
    // extra fields don't silently lose columns.
    const keys: string[] = [];
    this.rows.forEach((row) => {
      if (row && typeof row === 'object') {
        Object.keys(row).forEach((k) => {
          if (!keys.includes(k)) keys.push(k);
        });
      }
    });
    this.columns = keys;
  }

  remove() {
    this.eventService.emitGadgetDeleteEvent({ data: this.instanceId });
  }

  propertyChangeEvent(propertiesJSON: string) {
    const props = JSON.parse(propertiesJSON);

    if (props.title != undefined) this.title = props.title;
    if (props.subtitle != undefined) this.subtitle = props.subtitle;
    if (props.showStriped != undefined) this.showStriped = this.toBool(props.showStriped);
    if (props.showDense != undefined) this.showDense = this.toBool(props.showDense);
    if (props.showRowNumbers != undefined) this.showRowNumbers = this.toBool(props.showRowNumbers);
    if (props.maxRows != undefined) this.maxRows = Number(props.maxRows) || 0;

    // Column config must be applied before data so a re-parse picks it up,
    // and re-resolved afterwards in case only the column list changed.
    if (props.tableColumns != undefined) this.configuredColumns = props.tableColumns;
    if (props.tableData != undefined) {
      if (this.applyData(props.tableData)) {
        this.updatePropertyPageValue('tableData', props.tableData);
      }
    } else if (props.tableColumns != undefined) {
      this.resolveColumns();
    }

    this.boardService.savePropertyPageConfigurationToDestination(propertiesJSON, this.instanceId);
  }

  private updatePropertyPageValue(key: string, value: string) {
    this.propertyPages.forEach((page) => {
      page.properties.forEach((property: any) => {
        if (property.key === key) property.value = value;
      });
    });
  }
}
