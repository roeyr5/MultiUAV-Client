import { GridsterItem } from "angular-gridster2";
import { IGridsterParameter } from "./IChartEntity";
import { ChartType, SingleChart } from "../enums/chartType.enum";
import { EventEmitter } from "@angular/core";

// export interface Dataset {
//   uavNumber: number;
//   data: (number|string)[];
//   label: string;
//   color: string;
// }

// export interface ChartGridsterItem extends GridsterItem {
//   x: number;
//   y: number;
//   rows: number;
//   cols: number;
//   chartType: SingleChart; 
//   chartLabels: string[];
//   uavNames:string[];
//   communication: string;
//   parameter: string;
//   datasets: Dataset[];
//   showOptions: boolean;
//   units?: string; 
//   InterfaceLimitMin: number;  
//   InterfaceLimitMax: number; 
// }

export interface TelemetryGridsterItem extends GridsterItem, IGridsterParameter{
  // chartEntitys: IChartEntity[];
  isArchive: boolean;
  isConcatenated: boolean;
}

//using ICHartEntity