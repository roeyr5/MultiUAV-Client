import { ChartType } from '../enums/chartType.enum';

export interface IChartEntity {
  parameter: string;
  chartType: ChartType;
  dataevent: Event;
}
