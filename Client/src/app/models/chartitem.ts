import { GridsterItem } from "angular-gridster2";
import { ChartType } from "chart.js";

export interface ChartGridsterItem extends GridsterItem {
  chartType: ChartType; 
  chartData: number[]; 
  chartLabels: string[]; 
  parameter: string; 
  parameterName?: string;
}
