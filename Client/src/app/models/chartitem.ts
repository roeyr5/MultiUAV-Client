import { GridsterItem } from "angular-gridster2";
import { ChartType } from "angular-google-charts";

export interface ChartGridsterItem extends GridsterItem {
  chartType: ChartType; 
  chartLabels: string[];
  communication: string;
  parameter: string;
  datasets: Array<{
    uavName: string;
    data: number[];
    label: string;
    color: string;
  }>;
}
