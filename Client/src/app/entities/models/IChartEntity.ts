import { EventEmitter } from '@angular/core';
import { ChartType, SingleChart } from '../enums/chartType.enum';
import { IcdParameter } from '../IcdParameter';

export interface IGridsterParameter {
  parameterName: string;
  parameterComm: string;
  chartEntitys: IChartEntity[];
}

export class IChartEntity {
  id: string;
  parameter: IcdParameter;
  chartType: SingleChart;
  dataEvent: EventEmitter<any>;
  oldChartType?: SingleChart;
  minutesBack?: number;

  constructor(
    id: string,
    parameter: IcdParameter,
    chartType: SingleChart,
    dataEvent: EventEmitter<any>
  ) {
    this.id = id;
    this.parameter = parameter;
    this.chartType = chartType;
    this.dataEvent = dataEvent;
  }
}

export class graphEntity extends IChartEntity {
  graphElement: any;
  yScaleMin: number;
  yScaleMax: number;

  constructor(chart: IChartEntity) {
    super(chart.id, chart.parameter, chart.chartType, chart.dataEvent);
    this.yScaleMin = chart.parameter.InterfaceLimitMin;
    this.yScaleMax = chart.parameter.InterfaceLimitMax;
  }
}
