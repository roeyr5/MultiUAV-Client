import { GridsterItem } from "angular-gridster2";

export interface ChartGridsterItem extends GridsterItem {
  chartType: 'line' | 'bar' | 'gauge' | 'pie' ; 
  chartLabels: string[];
  communication: string;
  parameter: string;
  datasets: Array<{
    uavName: string;
    data: number[] ;
    label: string;
    color: string;
  }>;
  showOptions:boolean;
}
//using ICHartEntity