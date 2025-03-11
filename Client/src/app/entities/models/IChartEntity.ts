import { EventEmitter } from '@angular/core';
import { ChartType, SingleChart } from '../enums/chartType.enum';
import { IcdParameter } from '../IcdParameter';

export interface IGridsterParameter {
  parameterName: string;
  parameterComm: string;
  chartEntitys: IChartEntity[];
}

export class IChartEntity {
  parameter: IcdParameter;
  chartType: SingleChart;
  dataEvent: EventEmitter<any>;

  constructor(
    parameter: IcdParameter,
    chartType: SingleChart,
    dataEvent: EventEmitter<any>
  ) {
    this.parameter = parameter;
    this.chartType = chartType;
    this.dataEvent = dataEvent;
  }
}
