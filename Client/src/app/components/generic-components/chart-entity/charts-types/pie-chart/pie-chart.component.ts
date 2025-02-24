import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartType } from 'src/app/enums/chartType.enum';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {
  @Input() datasets: any[] = [];

  type: ChartType  = ChartType.Pie;
  
  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart(): void {
  }

}
