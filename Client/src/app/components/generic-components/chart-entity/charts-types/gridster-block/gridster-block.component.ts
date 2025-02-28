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
  @Output() updateChange = new EventEmitter<boolean>();
  @Output() chartDataUpdated = new EventEmitter<void>();

  chart: Highcharts.Chart | undefined;
  chartOptions: Highcharts.Options = {};

  constructor() {}

  ngOnInit(): void {
    this.chartId = `chart-container-${Math.random().toString(36).substr(2, 9)}`;
  }

  ngAfterViewInit(): void {
      this.createChart();
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
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        animation: false ,
        name: `UAV ${dataset.uavNumber}`,
        data: dataset.data,
        color: dataset.color,
        marker: {
          enabled: false,
        },
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

  handleNewData(uavNumber: number, communication:string,parameter:string) {
    this.updateChart(uavNumber,communication,parameter);
    this.chartDataUpdated.emit(); 
  }


public removeSpecificSeries(uavNumber: number): void {
  if (!this.chart) return;

  const seriesName = `UAV ${uavNumber}`;
  const seriesIndex = this.chart.series.findIndex(s => s.name === seriesName);
  
  if (seriesIndex !== -1) {
    this.chart.series[seriesIndex].remove();
    this.updateXAxisLabels(); 
  }
}

private updateXAxisLabels(): void {
  if (this.chart?.xAxis[0]) {
    this.chart.xAxis[0].update({
      categories: this.item.chartLabels
    });
  }
}

public recreateChart(): void {
  if (this.chart) {
    this.chart.destroy();
  }
  console.log(1)
  this.createChart();
}

  public updateChart(uavNumber:number,communication:string,parameter:string) {

    if (!this.chart) {
      console.error('Chart is not initialized yet');
      return;
    }
    
    // console.log('Current Datasets:', this.item.datasets);
    // console.log('Current Chart Labels:', this.item.chartLabels);

    const foundDataset = this.item.datasets.find(dataset => dataset.uavNumber === uavNumber);

    if (foundDataset) {
      const seriesName = `UAV ${uavNumber}`;
      let series = this.chart.series.find(s => s.name === seriesName);

     if (series) {
        series.setData([...foundDataset.data], false);
      } 
      else {
      this.chart.addSeries({
        name: seriesName,
        data: [...foundDataset.data],
        color: foundDataset.color,
        type: this.item.chartType,
        marker:{enabled : false}
      }, false);
    }
  }
  
   if (this.item.datasets[0].uavNumber === uavNumber) {
      if (this.chart.xAxis && this.item.chartLabels.length > 0) {
        console.log('Updating X-Axis Categories for the first UAV:', this.item.chartLabels);
        this.chart.xAxis[0].update({
          categories: this.item.chartLabels,
        }, false);  // Update without redrawing the entire chart
      }
    }

    // if (this.chart.xAxis && this.item.chartLabels.length > 0) {
    //   console.log('Updating X-Axis Categories:', this.item.chartLabels);
    //   this.chart.xAxis[0].update({
    //     categories: this.item.chartLabels,
    //   }, false);  
    // }
  
    this.chart.redraw();  
    this.updateChange.emit(true); 
  }
  
}
