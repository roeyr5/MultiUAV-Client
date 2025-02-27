import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartType } from 'src/app/entities/enums/chartType.enum';
@Component({
  selector: 'app-gauge-chart',
  templateUrl: './graph-chart.component.html',
  styleUrls: ['./graph-chart.component.css']
})
export class GraphChartComponent implements OnInit {

  type: ChartType  = ChartType.Graph;

  ngOnInit(): void {
    this.initializeChart();
  }

  initializeChart(): void {   
  }
}
