import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { index, tree } from 'd3';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {

  @Input() datasets: { label: string, data: number[],uavName:number, color: string }[] = [];
  @Input() chartLabels: string[] = [];
  @Input() chartTitle: string = '';
  @Input() chartType: 'line' | 'area' | 'bar' | 'scatter' | 'pie' | 'gauge' = 'line';

  chartOptions: Highcharts.Options = {
    series: [
      {
        type: 'line',
        data:[0]
      }
    ]
  };

  public Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;

  constructor() {}

  ngOnInit(): void {
    if (!this.chartType) {
      this.chartType = 'line';
    }
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datasets'] || changes['chartLabels']) {
      this.updateChart();
    }
  }
  
  private getChartConfig(): Highcharts.Options {
     this.chartOptions = {
      chart: {
        type: this.chartType,
      },
      title: {
        text: `parameter : ${this.chartTitle}`,
      },
      xAxis: {
        categories: this.chartLabels,
      },
      yAxis: {
        title: {
          text: 'Value'
        },
        min: 0,
        max: Math.max(...this.datasets.map(dataset => Math.max(...dataset.data))) * 1.1,
      },
      series: this.datasets.map(dataset => ({
        type:'spline',
        name: dataset.label,
        data: dataset.data,
      })),
    };
    if (this.chartType === 'line') {
      return {
        ...this.chartOptions,
        chart: {
          type: 'spline',
        },
        xAxis: {
          categories: this.chartLabels
        },
        series: this.datasets.map(dataset => ({
          type: 'spline',  
          name: dataset.label,
          data: dataset.data
        })),
      };
    }
    // if (this.chartType === 'pie') {
    //   return {
    //     ...commonChartConfig,
    //     chart: { type: 'pie' },
    //     series: [{
    //       name: 'Data',
    //       data: this.datasets.map(dataset => ({
    //         name: dataset.label,
    //         y: dataset.data.slice(-1)[0],  // Get the latest data point
    //         color: dataset.color
    //       }))
    //     }],
    //     tooltip: {
    //       pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    //     },
    //     plotOptions: {
    //       pie: {
    //         allowPointSelect: true,
    //         cursor: 'pointer',
    //         dataLabels: {
    //           enabled: true,
    //           format: '{point.name}: {point.percentage:.1f} %'
    //         }
    //       }
    //     }
    //   };
    // }

    // if (this.chartType === 'gauge') {
    //   return {
    //     chart: {
    //       type: 'solidgauge',  // Use 'solidgauge' or 'gauge' depending on your desired look
    //     },
    //     title: {
    //       text: this.chartTitle,
    //       align: 'center'
    //     },
    //     series: [{
    //       name: 'Gauge Data',
    //       data: [this.datasets.map(dataset => dataset.data.slice(-1)[0] || 0)[0]],  // Use the last value
    //       dataLabels: {
    //         format: '{y}',  // Display the value on the gauge
    //         borderWidth: 0,
    //         color: '#000000'
    //       },
    //       tooltip: {
    //         valueSuffix: ' units'
    //       }
    //     }],
    //     yAxis: {
    //       min: 0,
    //       max: 100,  // Adjust the max value as per your requirements
    //       title: {
    //         text: 'Gauge'
    //       },
    //       stops: [
    //         [0.1, '#55BF3B'], // Green
    //         [0.5, '#DDDF0D'], // Yellow
    //         [0.9, '#DF5353']  // Red
    //       ]
    //     }
    //   };
    // }

    if (this.chartType === 'bar') {
      return {
        ...this.chartOptions,
        chart: {
          type: 'column',
        },
        xAxis: {
          categories: this.chartLabels
        },
        series: this.datasets.map(dataset => ({
          type: 'bar',  
          name: dataset.label,
          data: dataset.data
        })),
      };
    }

    return this.chartOptions;
  }

  private initChart(): void {
    this.chartOptions = this.getChartConfig();
  }

  public updateChart(): void {
   if (!this.Highcharts) {
    console.error('Chart not initialized!');
     return;
   }

  this.chartOptions.series 
   this.updateFlag =true;
  }

  public updateChartType(newType: any): void {
    this.chartType = newType;
    this.chartOptions = this.getChartConfig();
  }
}
