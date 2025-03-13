import { Component, Input, ViewChild, ElementRef, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { pie } from 'd3';
import * as Highcharts from 'highcharts';
import { IPieConf,PieRecord } from 'src/app/entities/live-charts/pie.conf';
import { IChartEntity } from 'src/app/entities/models/IChartEntity';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  @Input() chartEntity!: IChartEntity;
  public pieRecords: PieRecord[] = [];
  public isSliderCheck:boolean = false;
  public liveValue :string ='';
 
  public pieConf: IPieConf = new IPieConf();
  
  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}
  
  ngOnInit(): void {

    this.chartEntity.dataEvent.subscribe((data:string) => {
      this.ngZone.run(() => {
        this.liveValue = data;
        this.addRecord(data);
        this.cdr.markForCheck();
      });
    });
  }


  public addRecord(data:string):void{
    let recordIndex = this.findRecordIndex(data);

    if(recordIndex!==-1){
      this.increaseRecordValue(recordIndex);
    }
    else{
      let pieRecord :PieRecord ={name:data, value: 1};
      this.pieRecords.push(pieRecord)
    }
    this.pieRecords =[...this.pieRecords];
  }

  public increaseRecordValue(recordIndex:number):void{
    let record = this.pieRecords[recordIndex];
    let updateValue = (Number(record.value));
    this.pieRecords[recordIndex].value =updateValue;
  }

  public findRecordIndex(recordName:string) : number{
    return this.pieRecords.findIndex(record =>{
      return record.name ===recordName;
    });
  }

  public formatValue():string{
    return `Currnet Value: ${this.liveValue}`
  }

  public pieConfig(): IPieConf{
    return this.pieConf;
  } 

  public onChangeSlider(){
    this.isSliderCheck = !this.isSliderCheck;
  }
 }