import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { BaseChartComponent } from '@swimlane/ngx-charts';
import {
  GraphRecordsList,
  GraphValue,
  IGraphConf,
} from 'src/app/entities/live-charts/graph.conf';

@Component({
  selector: 'app-graphs-chart',
  templateUrl: './graphs-chart.component.html',
  styleUrls: ['./graphs-chart.component.css'],
})
export class GraphsChartComponent  {

  // @Input() public chartEntities: IGraphsEntity[] = [];
  // public view: [number, number] = [0, 0];
  // public graphValues: GraphRecordsList[] = [];
  // public isGraphCleared: boolean = false;
  // // public readonly MAX_MS_WITHOUT_UPDATE = 5000;
  // private lastRecord: Number = 0;

  // constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  // public graphConf: IGraphConf = new IGraphConf();
  // public graphValue: number = 0;
  // // public size: number = 120;

  // @ViewChild('graph', { static: false }) graph!: BaseChartComponent;

  // ngOnInit(): void {
  //   var count = 0;
  //   this.chartEntities.forEach((entity)=>{
      
  //     let parameterName = entity.parameters[count++].parameterName;
  //     this.graphValues =[{
  //       name:parameterName,
  //       series:[],
      
  //     }]
  //   })
  //   // this.initGraph;

  //   setTimeout(() => {
  //     // @ts-ignore Cannot find name 'ResizeObserver'
  //     const resizeObserver = new ResizeObserver((entries) => {
  //       this.ngZone.run(() => {
  //         this.resizeGraph();
  //         this.cdr.markForCheck();
  //       });
  //     });
  //     resizeObserver.observe(
  //       document.getElementById(this.chartEntities[0].id.toString())!
  //     );
  //   }, 20);

  //   this.chartEntities.forEach((entity)=>{
  //     entity.dataEvent.subscribe((data:any)=>{
  //       this.ngZone.run(()=>{
  //         if (!this.isGraphCleared) {
  //           this.clearGraph();
  //           this.isGraphCleared = true;
  //         }
  //         this.addData(data)
  //         this.cdr.markForCheck();
  //       })
  //     })
  //   })
  // }

  // // public initGraph(): void {
  // //   setTimeout(() => {
  // //     this.chartEntity.graphElement = this.graph;
  // //   }, 1000);
  // // }

  // // public addGraph():void{

  // //   let newGraphData = {
  // //     name: this.chartEntity.parameter.parameterName,
  // //     series: [],
  // //   }
  // //   this.graphValues.push(newGraphData)
  // // }

  // public graphConfig(): IGraphConf {
  //   return this.graphConf;
  // }

  // public resizeGraph(): void {
  //   let parent = document.getElementById(this.chartEntities[0].id);
    
  //   if (parent) {      
  //     this.view = [0, 0];
  //     this.view.push(parent.offsetWidth, parent.offsetHeight);
  //   }
  // }

  // public addData(dataValue: any): void {
  //   if (!dataValue) return;

  //   const data: GraphValue = {
  //     name: new Date(Date.now()),
  //     value: dataValue,
  //   };
  //   this.graphValues[0].series.push(data);

  //   if (!this.lastRecord || dataValue != this.lastRecord) {
  //     this.lastRecord = dataValue;
  //     this.updateGraph();
  //   }

  //   if (
  //     this.graphValues[0].series.length >= this.graphConf.defaultRecordsCount
  //   ) {
  //     this.graphValues[0].series.splice(0, 1);
  //   }
  // }

  // public clearGraph(): void {
  //   this.graphValues[0].series.splice(0);
  //   this.updateGraph();
  // }

  // public updateGraph() {
  //   this.graphValues = [...this.graphValues];
  // }

  // // initialize() {
  // //   this.chart = Highcharts.chart(this.chartContainer.nativeElement, {
  // //     chart: { type: 'line' },
  // //     title: { text: this.item.parameter },
  // //     series: this.item.datasets.map(d => ({
  // //       type: 'line',
  // //       name: `UAV ${d.uavNumber}`,
  // //       data: d.data,
  // //       color: d.color
  // //     }))
  // //   });
  // // }

  // // updateData(uavNumber: number, value: string) {
  // //   const series = this.chart.series.find(s => s.name === `UAV ${uavNumber}`);
  // //   if (series) {
  // //     const numValue = parseFloat(value);
  // //     series.addPoint(numValue, true, series.data.length >= 10);
  // //   }
  // // }

  // // removeSeries(uavNumber: number) {
  // //   const series = this.chart.series.find(s => s.name === `UAV ${uavNumber}`);
  // //   if (series) {
  // //     series.remove();
  // //   }
  // // }

  // // recreateChart() {
  // //   this.chart.destroy();
  // //   this.initialize();
  // // }
}
