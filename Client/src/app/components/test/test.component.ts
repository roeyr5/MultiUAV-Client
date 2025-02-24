import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { HighchartsService } from './highcharts.service';

@Component({
  selector: 'my-app',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {

  @ViewChild('charts') public chartEl!: ElementRef;

  constructor(private highcharts: HighchartsService) { }

 
 
  
  
}
