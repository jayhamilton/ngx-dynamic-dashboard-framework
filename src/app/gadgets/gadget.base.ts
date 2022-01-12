import { IAction, IGadget, IPropertyPage, ITag } from './gadget.model';

export abstract class GadgetBase implements IGadget {
  componentType: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  instanceId: number;
  tags: ITag[];
  propertyPages: IPropertyPage[];;
  actions: IAction[];


  constructor() {
    this.componentType = '';
    this.title = '';
    this.subtitle = '';
    this.description = '';
    this.icon = '';
    this.instanceId = -1;
    this.tags = [];
    this.propertyPages = [];
    this.actions = [];
  }

  setConfiguration(gadgetData: IGadget){
    this.title = gadgetData.title;
  }

}
