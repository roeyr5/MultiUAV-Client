import { EventEmitter } from '@angular/core';
import { ChartType } from '../enums/chartType.enum';
import { IcdParameter } from '../IcdParameter';

export class IChartEntity {
  parameter: IcdParameter;
  chartType: ChartType;
  Dataevent: EventEmitter<any>;

  constructor(chart:IChartEntity){
    this.parameter = chart.parameter;
    this.chartType = chart.chartType;
    this.Dataevent = new EventEmitter<any>();

  }
}
