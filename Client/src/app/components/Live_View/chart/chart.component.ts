// src/app/components/chart/chart.component.ts
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartType } from 'angular-google-charts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnChanges {
  @Input() datasets: Array<{ label: string; data: number[]; color: string }> = [];
  @Input() chartLabels: string[] = [];
   // Use string literal
  @Input() chartTitle: string = '';
  @Input() chartOptions: any = {};

  public chartData: any[] = [];
  public chartColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChart();
  }

  public updateChart(): void {
    // Define column names based on datasets
    this.chartColumns = ['Time', ...this.datasets.map(ds => ds.label)];

    // Initialize dataTable with column names
    this.chartData = [this.chartColumns];

    // Populate dataTable with chartLabels and datasets
    for (let i = 0; i < this.chartLabels.length; i++) {
      const row = [this.chartLabels[i]];
      this.datasets.forEach(ds => {
        row.push(ds.data[i].toFixed()); // Default to 0 if data is undefined
      });
      this.chartData.push(row);
    }
  }
}
