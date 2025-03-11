import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartGridsterItem } from 'src/app/entities/models/chartitem';''
@Component({
  selector: 'app-graph-chart',
  template: `<div #chartContainer></div>`
})
export class GraphChartComponent {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @Input() item!: ChartGridsterItem;
  private chart!: Highcharts.Chart;

  // initialize() {
  //   this.chart = Highcharts.chart(this.chartContainer.nativeElement, {
  //     chart: { type: 'line' },
  //     title: { text: this.item.parameter },
  //     series: this.item.datasets.map(d => ({
  //       type: 'line',
  //       name: `UAV ${d.uavNumber}`,
  //       data: d.data,
  //       color: d.color
  //     }))
  //   });
  // }

  // updateData(uavNumber: number, value: string) {
  //   const series = this.chart.series.find(s => s.name === `UAV ${uavNumber}`);
  //   if (series) {
  //     const numValue = parseFloat(value);
  //     series.addPoint(numValue, true, series.data.length >= 10);
  //   }
  // }

  // removeSeries(uavNumber: number) {
  //   const series = this.chart.series.find(s => s.name === `UAV ${uavNumber}`);
  //   if (series) {
  //     series.remove();
  //   }
  // }

  // recreateChart() {
  //   this.chart.destroy();
  //   this.initialize();
  // }
}