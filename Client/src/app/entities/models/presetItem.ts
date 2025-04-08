import { SingleChart } from "../enums/chartType.enum";
import { IcdParameter } from "../IcdParameter";
import { GridsterItem } from "angular-gridster2";

// export interface presetDTO{
//   presetName:string;
//   presetItem:PresetItem[];
// }


export interface createPresetDto {
  email:string;
  presetName:string;
  presetItem: PresetItem[];
}

export interface PresetItem {
  parameterName : string;
  communication: string,
  isConcat: boolean,
  telemetryItems : GridsterItems[];
  cols: number,
  rows: number,
  x: number,
  y: number
}

export interface GridsterItems{
  parameter: IcdParameter;
  chartType: SingleChart;
}