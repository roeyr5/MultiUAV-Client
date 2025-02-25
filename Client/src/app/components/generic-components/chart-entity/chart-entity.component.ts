import { Component, Input } from '@angular/core';
import { ChartType } from 'src/app/entities/enums/chartType.enum';

@Component({
  selector: 'app-chart-entity',
  templateUrl: './chart-entity.component.html',
  styleUrls: ['./chart-entity.component.css']
})
export class ChartEntityComponent {

  @Input() entity: ChartType = ChartType.Gauge;

  }



