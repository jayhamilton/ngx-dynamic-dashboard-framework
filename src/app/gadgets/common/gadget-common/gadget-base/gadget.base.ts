import { IAction, IGadget, IPropertyPage, ITag } from './gadget.model';

export abstract class GadgetBase implements IGadget {
  componentType: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  instanceId: number;
  tags: ITag[];
  propertyPages: IPropertyPage[];
  actions: IAction[];
  inConfig: boolean;

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
    this.inConfig = false;
  }

  setConfiguration(gadgetData: IGadget) {
    this.title = gadgetData.title;
    this.subtitle = gadgetData.subtitle;
    this.instanceId = gadgetData.instanceId;
    this.actions = gadgetData.actions;
    this.description = gadgetData.description;
    this.propertyPages = [...gadgetData.propertyPages];
    this.tags = [...gadgetData.tags];
    this.icon = gadgetData.icon;
  }

  initializeConfiguration(gadgetData: IGadget) {
    this.title = gadgetData.title;
    this.subtitle = gadgetData.subtitle;
    this.instanceId = gadgetData.instanceId;
    this.actions = gadgetData.actions;
    this.description = gadgetData.description;
    this.propertyPages = gadgetData.propertyPages;
    this.tags = [...gadgetData.tags];
    this.icon = gadgetData.icon;
    this.inConfig = this.isMissingPropertyValue()
  }

  isMissingPropertyValue(){

    let isMissingPropertyValue = false;
    this.propertyPages.forEach((page)=>{
      page.properties.forEach((property)=>{

        if(property.value == "" && property.required == true){
          isMissingPropertyValue = true
        }

      });
    });

    return isMissingPropertyValue;
  }

  public toggleConfigMode() {
    this.inConfig = !this.inConfig;
  }

}
