import { IGadget } from '../gadgets/common/gadget-common/gadget-base/gadget.model';

export interface IBoardCollection {
  lastSelectedBoard: number;
  boardList: IBoard[];
}

export interface IBoard {
  title: string;
  description: string;
  structure: string;
  id: number;
  relationship: Hiearchy;
  tabs: ITab[];
  rows: IRow[];
}

export interface IRow {
  columns: IColumn[];
}

export interface IColumn {
  gadgets: IGadget[];
}

export enum BoardType {
  LASTSELECTED,
  IDSELECTED,
  DEFAULT,
  EMPTYBOARDCOLLECTION,
}

export enum Hiearchy {
  PARENT,
  CHILD,
}

export interface ITab {
  title: string;
  id: number;
}
