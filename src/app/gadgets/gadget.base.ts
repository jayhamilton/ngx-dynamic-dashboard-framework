import { IAction, IGadget, IPropertyPage, ITag } from './gadget.model';

export abstract class GadgetBase implements IGadget {
  constructor() {

  }

  public get componentType(): string {
    return this.componentType;
  }
  public set componentType(value: string) {
    this.componentType = value;
  }

  public get title(): string {
    return this.title;
  }
  public set title(value: string) {
    this.title = value;
  }

  public get subtitle(): string {
    return this.subtitle;
  }
  public set subtitle(value: string) {
    this.subtitle = value;
  }
  public get description(): string {
    return this.description;
  }
  public set description(value: string) {
    this.description = value;
  }

  public get icon(): string {
    return this.icon;
  }
  public set icon(value: string) {
    this.icon = value;
  }

  public get instanceId(): number {
    return this.instanceId;
  }
  public set instanceId(value: number) {
    this.instanceId = value;
  }

  public get tags(): ITag[] {
    return this.tags;
  }
  public set tags(value: ITag[]) {
    this.tags = value;
  }

  public get propertyPages(): IPropertyPage[] {
    return this.propertyPages;
  }
  public set propertyPages(value: IPropertyPage[]) {
    this.propertyPages = value;
  }

  public get actions(): IAction[] {
    return this.actions;
  }
  public set actions(value: IAction[]) {
    this.actions = value;
  }
}
