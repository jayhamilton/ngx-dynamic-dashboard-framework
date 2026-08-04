import { Type } from '@angular/core';
import { GadgetBase } from './common/gadget-common/gadget-base/gadget.base';

// Each entry is a dynamic import rather than a static one, so the bundler
// code-splits every gadget into its own chunk — a gadget type is only
// downloaded the first time a board actually needs to render one, instead of
// every gadget shipping in the app's initial bundle regardless of use.
export type GadgetLoader = () => Promise<Type<GadgetBase>>;

// componentType (from library.json / an IGadget) -> loader. Add new gadgets
// here instead of GadgetGridCellHostComponent's old switch statement.
export const GADGET_REGISTRY: Record<string, GadgetLoader> = {
  BarChartComponent: () =>
    import('./bar-chart/bar-chart.component').then((m) => m.BarChartComponent),
  AreaChartComponent: () =>
    import('./area-chart/area-chart.component').then((m) => m.AreaChartComponent),
  PieChartComponent: () =>
    import('./pie-chart/pie-chart.component').then((m) => m.PieChartComponent),
  BubbleChartComponent: () =>
    import('./bubble-chart/bubble-chart.component').then((m) => m.BubbleChartComponent),
  NumberCardComponent: () =>
    import('./number-card/number-card.component').then((m) => m.NumberCardComponent),
  LineChartComponent: () =>
    import('./line-chart/line-chart.component').then((m) => m.LineChartComponent),
  TableComponent: () =>
    import('./table/table.component').then((m) => m.TableComponent),
  StatisticComponent: () =>
    import('./statistic/statistic.component').then((m) => m.StatisticComponent),
  TextComponent: () =>
    import('./text/text.component').then((m) => m.TextComponent),
};
