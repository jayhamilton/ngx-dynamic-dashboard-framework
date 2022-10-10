export interface IGadget {
  componentType: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  instanceId: number;
  tags: ITag[];
  propertyPages: IPropertyPage[];
  actions: IAction[];
}

export interface ITag {
  facet: string;
  name: string;
}

export interface IPropertyPage {
  displayName: string;
  groupId: string;
  position: number;
  properties:IProperty[];
}

export interface IProperty {
  value:any;
  key: string ;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  options:[]
}

export interface IAction {
  name: string;
}



