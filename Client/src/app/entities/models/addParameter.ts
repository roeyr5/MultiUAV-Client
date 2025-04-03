import { GridsterItem } from "angular-gridster2";
import { SingleChart } from "../enums/chartType.enum";
import { IcdParameter } from "../IcdParameter";


export interface InsideParameterDTO extends GridsterItem {
  parameter: IcdParameter;
  chartType : SingleChart;
  parameterName: string;
  parameterComm: string;
  isConcat : boolean;
}