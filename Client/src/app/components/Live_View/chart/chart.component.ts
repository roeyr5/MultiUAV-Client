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

  @Input() datasets: { label: string, data: number[] , color: string }[] = [];
  @Input() chartLabels: string[] = [];
  @Input() chartTitle: string = '';
  @Input() chartType: 'line' | 'area' | 'bar' | 'scatter' | 'gauge' | 'pie' = 'line';

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

  private getChartConfig(): any {
    const commonChartConfig = {
      chart: {
        toolbar: { show: false }, 
      },
      fill: { 
        type: 'solid', 
        opacity: 1 
      },
      tooltip: {
        shared: true,
        intersect: false, 
        y: { formatter: (val: any) => `${val}` }
      },
    };

    if (this.chartType === 'gauge') {
      return {
        ...commonChartConfig,
        series: [{
          data: [this.datasets.map(dataset => dataset.data[dataset.data.length - 1] || 0)] 
        }],
        chart: { 
          type: 'radialBar', 
          height: 350 
        },
        plotOptions: {
          radialBar: {
            hollow: { size: '70%' },
            dataLabels: { 
              show: true, 
              name: { show: true }, 
              value: { show: true }
            }
          }
        },
        labels: this.datasets.map(dataset => dataset.label),
        title: { text: this.chartTitle, align: 'center' }
      };
    }

    // Pie Chart
    if (this.chartType === 'pie') {
      return {
        ...commonChartConfig,
        // Only show the latest value
        series: [this.datasets.map(dataset => dataset.data.slice(-1)[0] || 0)], // Latest value
        chart: { 
          type: 'pie', 
          height: 350 
        },
        labels: this.datasets.map(dataset => dataset.label),
        title: { text: this.chartTitle, align: 'center' },
        dataLabels: { enabled: true },
        legend: { position: 'top' },
        tooltip: {
          shared: true,
          intersect: false,
          y: { formatter: (val: any) => `${val}` }
        }
      };
    }

    // Bar Chart
    if (this.chartType === 'bar') {
      return {
        ...commonChartConfig,
        series: this.datasets.map(dataset => ({
          name: dataset.label,
          data: [...dataset.data]
        })),
        chart: {
          type: 'bar',
          height: '100%',
          width: '100%',
        },
        xaxis: {
          categories: [...this.chartLabels]
        },
        yaxis: {
          title: { text: 'Value' },
          min: 0,  
          max: Math.max(...this.datasets.map(dataset => Math.max(...dataset.data))) * 1.1,  
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          width: 2
        },
        markers: {
          size: 4
        },
        legend: { position: 'top' },
        title: {
          text: this.chartTitle,
          align: 'center'
        },
        fill: {
          type: 'solid',
          opacity: 1
        }
      };
    }

    // Default Chart (Line, Area, Scatter)
    return {
      ...commonChartConfig,
      series: this.datasets.map(dataset => ({
        name: dataset.label,
        data: [...dataset.data]
      })),
      chart: {
        type: this.chartType,
        height: '100%', 
        width: '100%',
      },
      xaxis: {
        categories: [...this.chartLabels]
      },
      yaxis: {
        title: { text: 'Value' },
        min: 0,  
        max: Math.max(...this.datasets.map(dataset => Math.max(...dataset.data))) * 1.1,  
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: this.chartType === 'area' ? 'smooth' : 'straight',  
      },
      markers: {
        size: 4
      },
      legend: { position: 'top' },
      title: {
        text: this.chartTitle,
        align: 'center'
      },
      fill: {
        type: this.chartType === 'area' ? 'gradient' : 'solid',
        opacity: 1
      }
    };
  }

  private initChart(): void {
    this.chartOptions = this.getChartConfig();
  }

  public updateChart(): void {
    if (this.chartOptions) {
      // Ensure chartLabels and dataset are valid
      if (!this.chartLabels || this.chartLabels.length === 0) {
        console.error('Chart labels are empty or undefined!');
      }
  
      // For Pie and Gauge charts, update series with the latest valid value
      if (this.chartType === 'pie' || this.chartType === 'gauge') {
        // Ensure the latest value is valid
        const latestValue = this.datasets.map(dataset => dataset.data.slice(-1)[0] || 0)[0];
        if (isNaN(latestValue)) {
          console.error('Received invalid value for Pie/Gauge chart:', latestValue);
        }
        this.chartOptions.series = [{
          name: this.datasets[0]?.label || 'Default',  // Optionally add a label
          data: [latestValue]  // Only update with the latest valid value
        }];
      } else {
        // Handle other chart types (e.g., bar, line, area, etc.)
        this.chartOptions.series = this.datasets.map(dataset => ({
          name: dataset.label,
          data: dataset.data.filter(val => !isNaN(val))  // Remove invalid data points (NaN)
        }));
      }
  
      if (!this.chartOptions.xaxis) {
        this.chartOptions.xaxis = { categories: [] };
      }
  
      if (this.chartOptions.xaxis && this.chartLabels.length > 0) {
        this.chartOptions.xaxis.categories = [...this.chartLabels];
      } else {
        console.error('Invalid chart labels for x-axis:', this.chartLabels);
      }
  
      this.chartOptions = { ...this.chartOptions };
    }
  }
  
  
  

  public updateChartType(newType: any): void {
    this.chartType = newType;
    this.chartOptions = this.getChartConfig();
  }
}
