import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnInit,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { IGaugeConf } from 'src/app/entities/live-charts/gauge.conf';
// import { ChartGridsterItem } from 'src/app/entities/models/chartitem';
import {
  IChartEntity,
  IGridsterParameter,
} from 'src/app/entities/models/IChartEntity';
import { GetTimeShift, SingleChart } from 'src/app/entities/enums/chartType.enum';
import { graphChartTypes } from 'src/app/entities/enums/chartType.enum';
import { pieChartTypes } from 'src/app/entities/enums/chartType.enum';
import { ChangeChartType } from 'src/app/entities/enums/chartType.enum';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.css'],
})
export class GaugeChartComponent implements OnInit {
  graphOptions = [
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
      {
        label: SingleChart.PIE,
        image: 'assets/images/pie_chart_icon.png',
        subOptions: [
          {
            label: pieChartTypes.regular,
            image: 'assets/images/pie_regular.png',
          },
        ],
      },
    ];
    
  @Output() newChartType = new EventEmitter<ChangeChartType>();
  @Output() getTimeShift = new EventEmitter<GetTimeShift>();

  @Input() chartEntity!: IChartEntity;
  public gaugeConf: IGaugeConf = new IGaugeConf();

  public gaugeValue: number = 0;
  public size: number = 120;
  public mode : string = 'live'

  private dataSub?: Subscription;
  

  changes!:ChangeChartType;
  timeShiftChange!:GetTimeShift;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit(): void {
    setTimeout(() => {
      //@ts-ignore Cannot find name 'ResizeObserver'
      const resizeObserver = new ResizeObserver((entries) => {
        this.ngZone.run(() => {
          this.resizeGauge();
          this.cdr.markForCheck();
        });
      });
      resizeObserver.observe(
        document.getElementById(this.chartEntity.id.toString())!
      );
    }, 20);

    this.dataSub = this.chartEntity.dataEvent.subscribe((value) => {
      this.gaugeValue = Number(value);
    });
  }

  public gaugeConfig(): IGaugeConf {
    return this.gaugeConf;
  }

  public resizeGauge(): void {

    let parent = document.getElementById(this.chartEntity.id);
    if (parent) {
      let parentWidth: number = +parent.offsetWidth;
      let parentHeight: number = +parent.offsetHeight;
      this.size =
        parentHeight < parentWidth ? parentHeight : 0.95 * parentWidth;
    }
  }
  public getGaugeValueClass(value: number): string {
    return 'gauge-value'
  //   if (value < 30) {
  //     return 'low-value';
  //   } else if (value < 70) {
  //     return 'medium-value';
  //   } else {
  //     return 'high-value';
  //   }
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
    this.gaugeValue = 0;
    this.dataSub = this.chartEntity.dataEvent.subscribe((value) => {
      this.gaugeValue = Number(value);
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
