import { Component, Input,Output,EventEmitter, ViewChild, ElementRef, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { pie } from 'd3';
import * as Highcharts from 'highcharts';
import { IPieConf,PieRecord } from 'src/app/entities/live-charts/pie.conf';
import { IChartEntity } from 'src/app/entities/models/IChartEntity';
import { ChangeChartType, GetTimeShift } from 'src/app/entities/enums/chartType.enum';
import { SingleChart } from 'src/app/entities/enums/chartType.enum';
import { gaugeChartTypes } from 'src/app/entities/enums/chartType.enum';
import { graphChartTypes } from 'src/app/entities/enums/chartType.enum';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnInit {

  public mode : string = 'live'

   graphOptions = [
          {
            label: SingleChart.GAUGE,
            image: 'assets/images/gauge_chart_icon.png',
            subOptions: [
              {
                label: gaugeChartTypes.regular,
                image: 'assets/images/gauge_regular.png',
              },
              {
                label: gaugeChartTypes.pointer,
                image: 'assets/images/gauge_pointer.png',
              },
            ],
          },
          {
            label: SingleChart.GRAPH,
            image: 'assets/images/line_chart_icon.png',
            subOptions: [
              {
                label: graphChartTypes.regular,
                image: 'assets/images/line_regular.png',
              },
            ],
          },
        ];
  
  changes!:ChangeChartType
  @Output() newChartType = new EventEmitter<ChangeChartType>();
  @Output() getTimeShift = new EventEmitter<GetTimeShift>();

  @Input() chartEntity!: IChartEntity;
  public pieRecords: PieRecord[] = [];
  public isSliderCheck:boolean = false;
  public liveValue :string ='';
 
  private dataSub?: Subscription;
  
  timeShiftChange!:GetTimeShift;

  public pieConf: IPieConf = new IPieConf();
  
  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}
  
  ngOnInit(): void {

    this.dataSub = this.chartEntity.dataEvent.subscribe((data:string) => {
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

  public changeChartType(newChartType: SingleChart): void {
    this.changes = {
      chartType: newChartType,
      chartEntity: this.chartEntity,
    };
    this.newChartType.emit(this.changes);
  }


  public backToLive():void{
    this.dataSub?.unsubscribe();

    this.dataSub = this.chartEntity.dataEvent.subscribe((data:string) => {
      this.ngZone.run(() => {
        this.liveValue = data;
        this.addRecord(data);
        this.cdr.markForCheck();
      });
    });
    this.mode= "live";
  }


   public timeShiftMode():void{
        Swal.fire({
           title: 'Catch-up interval',
           text: 'How many minutes back would you like to fetch?',
           input: 'number',
           inputLabel: 'Minutes',
           inputPlaceholder: 'Enter number of minutes',
           inputAttributes: {
             min: '1',
             step: '1'
           },
           showCancelButton: true,
           confirmButtonText: 'Go',
           cancelButtonText: 'Cancel',
           inputValidator: (value) => {
             if (!value) {
               return 'You need to enter a number';
             }
             const n = Number(value);
             if (isNaN(n) || n <= 0 || !Number.isInteger(n)) {
               return 'Please enter a positive whole number';
             }
             return null; 
           }
         }).then((result) => {
           if (result.isConfirmed) {
             const minutesBack = parseInt(result.value, 10);
             console.log('User wants to go back', minutesBack, 'minutes');
             // this.chartEntity.dataEvent.unsubscribe();
             this.dataSub?.unsubscribe();
  
             this.timeShiftChange= {
                minutesBack: minutesBack,
                newChartType: SingleChart.GRAPH,
                oldChartType: this.chartEntity.chartType,
                chartEntity: this.chartEntity,
             };
  
             this.getTimeShift.emit(this.timeShiftChange);
  
             this.mode = 'shift'
           }
         });
    } 
}