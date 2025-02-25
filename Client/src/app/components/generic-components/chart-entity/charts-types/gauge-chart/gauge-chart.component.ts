import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as Highcharts from 'highcharts';
import SolidGauge from 'highcharts/modules/solid-gauge';
// SolidGauge(Highcharts);

@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.css']
})
export class GaugeChartComponent  {

  @ViewChild('container') container!: ElementRef;
  chart: Highcharts.Chart | undefined;

  // constructor() { }

  // ngOnInit(): void {
  //   // this.createChart(50); 
  // }

  // createChart(initialValue: number): void {
  //   this.chart = Highcharts.chart(this.container.nativeElement, {
  //     chart: {
  //       type: 'solidgauge'
  //     },
  //     title: null,
  //     pane: {
  //       center: ['50%', '50%'],
  //       size: '100%',
  //       startAngle: -90,
  //       endAngle: 90,
  //       background: {
  //         backgroundColor: '#EEE',
  //         innerRadius: '60%',
  //         outerRadius: '100%',
  //         shape: 'arc'
  //       }
  //     },
  //     yAxis: {
  //       min: 0,
  //       max: 100,
  //       stops: [
  //         [0.1, '#55BF3B'], // Green
  //         [0.5, '#DDDF0D'], // Yellow
  //         [0.9, '#DF5353']  // Red
  //       ],
  //       tickInterval: 10,
  //       labels: {
  //         y: -20
  //       }
  //     },
  //     series: [{
  //       name: 'Speed',
  //       data: [initialValue], // Initial data
  //       dataLabels: {
  //         y: 5,
  //         borderWidth: 0,
  //         useHTML: true
  //       }
  //     }]
  //   });
  // }

  updateChart(newValue: number): void {
    if (this.chart) {
      this.chart.series[0].setData([newValue], true);  
    }
  }
}
