import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartGridsterItem } from 'src/app/entities/models/chartitem';
import { IChartEntity, IGridsterParameter } from 'src/app/entities/models/IChartEntity';

@Component({
  selector: 'app-pie-chart',
  template: `<div #chartContainer></div>`
})
export class PieChartComponent {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @Input() chartEntity!: IChartEntity;
  private chart!: Highcharts.Chart;

  // initialize() {
  //   this.chart = Highcharts.chart(this.chartContainer.nativeElement, {
  //     chart: { type: 'pie' },
  //     title: { text: this.item.parameter },
  //     series: [{
  //       type: 'pie',
  //       name: 'Values',
  //       data: this.item.datasets.map(d => ({
  //         name: `UAV ${d.uavNumber}`,
  //         y: parseFloat(d.data.slice(-1)[0]),
  //         color: d.color
  //       }))
  //     }]
  //   });
  // }

  // updateData(uavNumber: number, value: string) {
  //   const point = this.chart.series[0].data.find(p => p.name === `UAV ${uavNumber}`);
  //   if (point) {
  //     point.update(parseFloat(value));
  //   }
  // }

  // recreateChart() {
  //   this.chart.destroy();
  //   this.initialize();
  // }
}