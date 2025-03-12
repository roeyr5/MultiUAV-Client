import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { IChartEntity } from 'src/app/entities/models/IChartEntity';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @Input() chartEntity!: IChartEntity;
  private chart!: Highcharts.Chart;
  private resizeObserver!: ResizeObserver;

  ngOnInit() {
    this.initializeChart();
    this.setupResizeObserver();
    
    this.chartEntity.dataEvent.subscribe((value: string) => {
      this.updateChart(Number(value));
    });
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    if (this.chart) this.chart.destroy();
  }

  private initializeChart() {
    this.chart = Highcharts.chart(this.chartContainer.nativeElement, {
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: '100%'
      },
      title: {
        text: this.chartEntity.parameter.parameterName,
        style: { color: 'white' }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            style: { color: 'white' }
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Values',
        data: [{
          name: `UAV ${this.chartEntity.parameter.uavNumber}`,
          y: 0,
          color: this.getColor()
        }]
      }]
    });
  }

  private updateChart(value: number) {
    this.chart.series[0].update({
      type: 'pie', 
      data: [{
        name: `UAV ${this.chartEntity.parameter.uavNumber}`,
        y: value,
        color: this.getColor()
      }]
    }, true);
  }

  private getColor(): string {
    // Implement your color logic here
    return '#' + Math.floor(Math.random()*16777215).toString(16);
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.chart?.reflow();
    });
    this.resizeObserver.observe(this.chartContainer.nativeElement);
  }
}