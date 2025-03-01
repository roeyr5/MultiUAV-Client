import { GridsterItem } from "angular-gridster2";
import { IChartEntity } from "./IChartEntity";
import { ChartType } from "../enums/chartType.enum";

export interface Dataset {
  uavNumber: number;
  data: (number|string)[];
  label: string;
  color: string;
}

export interface ChartGridsterItem extends GridsterItem {
  x: number;
  y: number;
  rows: number;
  cols: number;
  chartType: ChartType; 
  chartLabels: string[];
  uavNames:string[];
  communication: string;
  parameter: string;
  datasets: Dataset[];
  showOptions: boolean;
  units?: string; 
}

//using ICHartEntity