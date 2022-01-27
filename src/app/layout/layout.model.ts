
export enum LayoutType {

  ONE_COL = "one_col",
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
];
