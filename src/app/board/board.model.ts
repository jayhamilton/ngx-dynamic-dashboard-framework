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
  icon?: string;
  /**
   * Whole-board side-padding preset ('full' | 'normal' | 'narrow', see
   * BoardWidth in layout.model.ts). Optional so boards saved before this
   * setting existed fall back to 'normal', which reproduces their original
   * padding exactly.
   */
  contentWidth?: string;
}

export interface IRow {
  columns: IColumn[];
  /**
   * Per-row layout. Optional so boards saved before multi-row support keep
   * working — those rows fall back to the board-level `structure`.
   */
  structure?: string;
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
