import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ApexMarkers,
  ApexLegend,
  ApexTitleSubtitle,
  ApexFill
} from 'ng-apexcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {

  @Input() datasets: { label: string, data: number[], color: string }[] = [];
  @Input() chartLabels: string[] = [];
  @Input() chartTitle: string = '';
  @Input() chartType: 'line' | 'area' | 'bar' | 'scatter' | 'gauge' = 'line'; 
  
  public chartOptions!: {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis | ApexYAxis[]; 
    dataLabels: ApexDataLabels;
    stroke: ApexStroke;
    tooltip: ApexTooltip;
    markers: ApexMarkers;
    legend: ApexLegend;
    title: ApexTitleSubtitle;
    fill: ApexFill;
  };
  

  constructor() {}

  ngOnInit(): void {
    this.initChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datasets'] || changes['chartLabels']) {
      this.updateChart();
    }
  }

  private getChartConfig(): any {
    if (this.chartType === 'gauge') {
      return {
        series: this.datasets.map(dataset => dataset.data[dataset.data.length - 1] || 0),
        chart: { type: "radialBar", height: 350 },
        plotOptions: {
          radialBar: {
            hollow: { size: "70%" },
            dataLabels: { show: true }
          }
        },
        labels: this.datasets.map(dataset => dataset.label),
        title: { text: this.chartTitle, align: "center" },
        fill: { type: "solid", opacity: 1 } 
      };
    }

    return {
      series: this.datasets.map(dataset => ({
        name: dataset.label,
        data: [...dataset.data]
      })),
      chart: {
        type: this.chartType,
        height: 350
      },
      xaxis: { categories: [...this.chartLabels] },
      yaxis: { title: { text: "Value" } },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth" },
      markers: { size: 4 },
      tooltip: { shared: true },
      legend: { position: "top" },
      title: { text: this.chartTitle, align: "center" },
      fill: { type: "solid", opacity: 1 } 
    };
  }

  private initChart(): void {
    this.chartOptions = this.getChartConfig();
  }

  public updateChart(): void {
    if (this.chartOptions) {
      this.chartOptions.series = this.datasets.map(dataset => ({
        name: dataset.label,
        data: [...dataset.data]
      }));
      
      (this.chartOptions.xaxis as any).categories = [...this.chartLabels];

      this.chartOptions = { ...this.chartOptions };
    }
  }

  public updateChartType(newType: 'line' | 'area' | 'bar' | 'scatter' | 'gauge'): void {
    this.chartType = newType;
    this.chartOptions = this.getChartConfig();
  }
}
