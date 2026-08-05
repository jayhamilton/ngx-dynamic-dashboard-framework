
export enum LayoutType {

  ONE_COL = "one_col",
  ONE_COL_FULL = "one_col_full",
  TWO_COL_EQUAL = "two_col_equal",
  TWO_COL_NARROW_WIDE = "two_col_narrow_wide",
  TWO_COL_WIDE_NARROW = "two_col_wide_narrow",
  THREE_COL_EQUAL = "three_col_equal"
}


export const layouts = [
  {
    id: 0,
    structure: LayoutType.ONE_COL,
  },
  {
    id: 1,
    structure: LayoutType.TWO_COL_EQUAL,
  },
  {
    id: 2,
    structure: LayoutType.TWO_COL_NARROW_WIDE,
  },
  {
    id: 3,
    structure: LayoutType.TWO_COL_WIDE_NARROW,
  },
  {
    id: 4,
    structure: LayoutType.THREE_COL_EQUAL,
  },
  {
    id: 5,
    structure: LayoutType.ONE_COL_FULL,
  },
];

export enum BoardWidth {
  FULL = "full",
  NORMAL = "normal",
  NARROW = "narrow",
}

export interface IBoardWidthOption {
  value: BoardWidth;
  label: string;
  icon: string;
  description: string;
}

export const boardWidths: IBoardWidthOption[] = [
  {
    value: BoardWidth.FULL,
    label: "Full width",
    icon: "fullscreen",
    description: "Rows stretch edge to edge with minimal side padding",
  },
  {
    value: BoardWidth.NORMAL,
    label: "Normal width",
    icon: "view_agenda",
    description: "The default side padding used today",
  },
  {
    value: BoardWidth.NARROW,
    label: "Narrow",
    icon: "view_column",
    description: "Extra side padding for a more constrained, readable column",
  },
];
