import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { IGaugeConf } from 'src/app/entities/live-charts/gauge.conf';
import { ChartGridsterItem } from 'src/app/entities/models/chartitem';

@Component({
  selector: 'app-gauge-chart',
  template: `<div #chartContainer></div>`,
})
export class GaugeChartComponent {
  @Input() item!: ChartGridsterItem;
  public gaugeConf: IGaugeConf = new IGaugeConf();

  public gaugeValue: number = 0;
  public size: number = 200;

  public gaugeConfig(): IGaugeConf {
    return this.gaugeConf;
  }
  
}
