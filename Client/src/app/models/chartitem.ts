import { GridsterItem } from "angular-gridster2";

export interface ChartGridsterItem extends GridsterItem {
  chartType: 'line' | 'area' | 'bar' | 'scatter'| 'gauge' ; 
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
