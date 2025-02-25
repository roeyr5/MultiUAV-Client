import { Component, Input } from '@angular/core';
import { ChartType } from 'src/app/entities/enums/chartType.enum';

@Component({
  selector: 'app-gridster-box',
  templateUrl: './gridster-box.component.html',
  styleUrls: ['./gridster-box.component.css']
})
export class GridsterBoxComponent {

  cols : number = 1;
  rows : number = 1;
  chartType : ChartType = ChartType.Gauge;
  chartLabels: [] = [];
  communication : string = '';
  parameter : string = '';
  datasets: [] = [];
  showOptions : boolean = false;

  @Input() xValue : number = -1;
  @Input() yValue : number = -1;
 

  // if (!foundItem) {
  //   foundItem = {
  //     cols: 1,
  //     rows: 1,
  //     x: this.dashboard.length % 5,
  //     y: Math.floor(this.dashboard.length / 5),
  //     chartType: 'line',
  //     chartLabels: [],
  //     communication,
  //     parameter,
  //     datasets: [],
  //     showOptions : false
  //   };
  //   this.dashboard.push(foundItem);
}
