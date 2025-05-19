import { Component, Input, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { IChartEntity } from 'src/app/entities/models/IChartEntity';
import { GraphRecordsList, GraphValue } from 'src/app/entities/live-charts/graph.conf';
import { Subscription } from 'rxjs';
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-concat-graph',
  templateUrl: './concat-graph.component.html',
  styleUrls: ['./concat-graph.component.css']
})

export class ConcatGraphComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() chartEntities: IChartEntity[] = [];
  public graphValues: GraphRecordsList[] = [];
  public view: [number, number] = [0, 0];
  private subscriptions: Subscription[] = [];
  public colorScheme = [
    '#5AA454',  
    '#A10A28',  
    '#C7B42C', 
    '#AAAAAA',  
    '#FFA500',  
    '#2F4F4F'   
  ];

  public graphConf = {
    colors: this.colorScheme,
    gradient: false,
    showXAxis: true,
    showYAxis: true,
    showLegend: true,
    showXAxisLabel: true,
    showYAxisLabel: true,
    defaultRecordsCount: 10
  };

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.graphValues = this.chartEntities.map(entity => ({
      name: `${entity.parameter.uavNumber}`,
      series: [],
      color: this.generateColor(entity.parameter.uavNumber)
    }));

    this.chartEntities.forEach((entity, index) => {
      const subscription = entity.dataEvent.subscribe((data: any) => {
        this.ngZone.run(() => {
          this.addData(index, data);
          this.cdr.markForCheck();
        });
      });
      this.subscriptions.push(subscription);
    });

    // setTimeout(() => {
    //   const resizeObserver = new ResizeObserver(() => {
    //     this.ngZone.run(() => {
    //       // this.resizeGraph();
    //       this.cdr.markForCheck();
    //     });
    //   });
    //   const parent = document.querySelector('.widget-content');
    //   if (parent) resizeObserver.observe(parent);
    // }, 20);

    setTimeout(() => {
      // @ts-ignore Cannot find name 'ResizeObserver'
      const resizeObserver = new ResizeObserver((entries) => {
        this.ngZone.run(() => {
          this.updateGraphSize();
          this.cdr.markForCheck();
        });
      });
      resizeObserver.observe(
        document.getElementById("id")!
      );
    }, 20);
  }

  ngAfterViewInit(): void {
    this.updateGraphSize();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private generateColor(uavId: number): string {
    const colors = this.colorScheme;
    return colors[uavId % colors.length];
  }
  
  public addData(seriesIndex: number, dataValue: any): void {
    const newDataPoint = { 
      name: new Date(), 
      value: dataValue 
    };
  
    const updatedSeries = [
      ...this.graphValues[seriesIndex].series,
      newDataPoint
    ];
  
    if (updatedSeries.length > 10) {
      updatedSeries.shift();
    }

    this.graphValues[seriesIndex].series = updatedSeries;
    this.graphValues = [...this.graphValues];
  }

  // public resizeGraph(): void {
  //   const parent = document.querySelector('.widget-content');
  //   if (parent) {
  //     this.view = [parent.offsetWidth, parent.offsetHeight];
  //   }
  // }

  updateGraphSize() {
    const element = document.getElementById("id");
    if (element) {
      const width = element.offsetWidth;
      const height = element.offsetHeight;

      // Only update the view size if it's changed
      if (this.view[0] !== width || this.view[1] !== height) {
        this.view = [width, height];
        this.cdr.detectChanges(); // Manually trigger change detection
      }
    } else {
      console.log('Element not found');
    }
  }
}