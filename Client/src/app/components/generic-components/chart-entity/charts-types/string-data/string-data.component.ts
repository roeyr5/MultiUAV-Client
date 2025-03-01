import { Component, Input } from '@angular/core';
import { ChartGridsterItem } from 'src/app/entities/models/chartitem';
@Component({
  selector: 'app-string-data',
  templateUrl: './string-data.component.html',
  styleUrls: ['./string-data.component.css']
})
export class StringDataComponent {

  @Input() item!: ChartGridsterItem;

  public get latestValue(): string {
    const lastValue = this.item.datasets[0]?.data[this.item.datasets[0].data.length - 1];
    return lastValue !== undefined ? lastValue.toString() : ''; 
  }
}

