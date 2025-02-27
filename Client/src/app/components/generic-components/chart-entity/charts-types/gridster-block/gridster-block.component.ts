import { Component, Input, OnInit, SimpleChanges, Output, EventEmitter, NgZone, inject, AfterViewInit } from '@angular/core';
import { ChartGridsterItem, Dataset } from '../../../../../entities/models/chartitem';
import * as Highcharts from 'highcharts';
import 'highcharts/modules/accessibility';

import { ChartType } from 'src/app/entities/enums/chartType.enum';
@Component({
  selector: 'app-gridster-block',
  templateUrl: './gridster-block.component.html',
  styleUrls: ['./gridster-block.component.css']
})
export class GridsterBlockComponent implements OnInit,AfterViewInit {
  public chartId: string = '';
  ngZone = inject(NgZone);

  @Input() item!:ChartGridsterItem;
  // @Input() x: number = 0;
  // @Input() y: number = 0;
  // @Input() rows: number = 1;
  // @Input() cols: number = 1;
  // @Input() communication: string = '';
  // @Input() parameterName: string = '';
  // @Input() chartType: ChartType = ChartType.Graph;
  // @Input() chartLabels: string[] = [];
  // @Input() datasets: Dataset[] = [];

  @Output() updateChange = new EventEmitter<boolean>();
  @Output() chartDataUpdated = new EventEmitter<void>();

  chart: Highcharts.Chart | undefined;
  chartOptions: Highcharts.Options = {};

  constructor() {}

  ngOnInit(): void {
    this.chartId = `chart-container-${Math.random().toString(36).substr(2, 9)}`;
    this.createChart();  
  }

  ngAfterViewInit(): void {
    if (this.item.datasets.length > 0) {
      this.createChart();
  }  
}

  createChart() {
    this.chartOptions = {
      title: {
        text: this.item.parameter,
      },
      xAxis: {
        categories: this.item.chartLabels,
      },
      accessibility: {
        enabled: false,
      },
      series: this.item.datasets.map(dataset => ({
        type: this.item.chartType,
        name: `UAV ${dataset.uavNumber}`,
        data: dataset.data,
        color: dataset.color,
      })) as Highcharts.SeriesOptionsType[],

      responsive: {
        rules: [{
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: {
              layout: 'horizontal',
              align: 'center',
              verticalAlign: 'bottom',
            },
          },
        }],
      },
    };

    this.chart = Highcharts.chart(this.chartId, this.chartOptions);

  }

  
  handleNewData() {
    this.updateChart();
    this.chartDataUpdated.emit(); 
  }


  updateChart() {
    if (!this.chart) {
      console.error('Chart is not initialized yet');
      return;
    }
  
    // console.log('Current Datasets:', this.item.datasets);
    // console.log('Current Chart Labels:', this.item.chartLabels);
  
    this.item.datasets.forEach((dataset, index) => {
      let series = this.chart?.series ? this.chart.series[index] : undefined;
  
      if (series) {
        console.log(`Updating Series ${index} with data:`, dataset.data);
        series.setData(dataset.data, false); 
      } 
      else 
      {
        series = this.chart?.addSeries({
          name: `UAV ${dataset.uavNumber}`,
          data: dataset.data,
          color: dataset.color,
          type: this.item.chartType, 
        }, false);
      }
    });
  
    if (this.chart.xAxis && this.item.chartLabels.length > 0) {
      console.log('Updating X-Axis Categories:', this.item.chartLabels);
      this.chart.xAxis[0].update({
        categories: this.item.chartLabels,
      }, false);  
    }
  
    this.chart.redraw();  
    this.updateChange.emit(true); 
  }
  
}
