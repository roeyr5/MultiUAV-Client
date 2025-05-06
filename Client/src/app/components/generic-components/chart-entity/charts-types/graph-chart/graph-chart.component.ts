import {
  Component,
  Input,Output,EventEmitter,
  ViewChild,
  ElementRef,
  OnInit,
  ChangeDetectorRef,
  NgZone,
  AfterViewInit,
} from '@angular/core';
import { BaseChartComponent } from '@swimlane/ngx-charts';
import {
  GraphRecordsList,
  GraphValue,
  IGraphConf,
} from 'src/app/entities/live-charts/graph.conf';
// import { ChartGridsterItem } from 'src/app/entities/models/chartitem';
import {
  graphEntity,
  IChartEntity,
  IGridsterParameter,
} from 'src/app/entities/models/IChartEntity';
('');
import { ChangeChartType, GetTimeShift } from 'src/app/entities/enums/chartType.enum';
import { SingleChart } from 'src/app/entities/enums/chartType.enum';
import { gaugeChartTypes } from 'src/app/entities/enums/chartType.enum';
import { pieChartTypes } from 'src/app/entities/enums/chartType.enum';
import { min, Subscription } from 'rxjs';
import { ArchiveManyRequestDto } from 'src/app/entities/models/archiveDto';
import { ArchiveService } from 'src/app/services/archive.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-graph-chart',
  templateUrl: './graph-chart.component.html',
  styleUrls: ['./graph-chart.component.css'],
})
export class GraphChartComponent implements OnInit, AfterViewInit {
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

  changes!:ChangeChartType;
  // timeShiftChange!:GetTimeShift;

  @Output() newChartType = new EventEmitter<ChangeChartType>();
  @Output() getTimeShift = new EventEmitter<GetTimeShift>();
  @Input() chartEntity!: IChartEntity;

  public mode : string = 'live'
  public view: [number, number] = [0, 0];
  public  graphValues: GraphRecordsList[] = [];
  public isGraphCleared: boolean = false;
  // public readonly MAX_MS_WITHOUT_UPDATE = 5000;
  private lastRecord: Number = 0;
  private dataSub?: Subscription;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone,private _archiveService: ArchiveService) {}

  ngAfterViewInit(): void {
    this.updateGraphSize();
  }

  public graphConf: IGraphConf = new IGraphConf();
  public graphValue: number = 0;
  // public size: number = 120;

  @ViewChild('graph', { static: false }) graph!: ElementRef;

  ngOnInit(): void {
    console.log(1);
    console.log(this.chartEntity);
    
    this.graphValues = [
      {
        name: this.chartEntity.parameter.parameterName,
        series: [],
      },
    ];
    // this.initGraph;

    setTimeout(() => this.cdr.detectChanges(), 0);
    setTimeout(() => {
      // @ts-ignore Cannot find name 'ResizeObserver'
      const resizeObserver = new ResizeObserver((entries) => {
        this.ngZone.run(() => {
          this.updateGraphSize();
          this.cdr.markForCheck();
        });
      });
      resizeObserver.observe(
        document.getElementById(this.chartEntity.id.toString())!
      );
    }, 20);

    if(this.chartEntity.minutesBack){
      this.loadLastMinuteData(this.chartEntity.minutesBack);
    }
    else{
      this.dataSub = this.chartEntity.dataEvent.subscribe((data: any) => {
        this.ngZone.run(() => {
          if (!this.isGraphCleared) {
            this.clearGraph();
            this.isGraphCleared = true;
          }
          this.addData(data);
          this.cdr.markForCheck();
        });
      });
    }
    
  }

  updateGraphSize() {
    const element = document.getElementById(this.chartEntity.id.toString());
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

  // public initGraph(): void {
  //   setTimeout(() => {
  //     this.chartEntity.graphElement = this.graph;
  //   }, 1000);
  // }

  public addGraph():void{
    
    let newGraphData = {
      name: this.chartEntity.parameter.parameterName,
      series: [],
    }
    this.graphValues.push(newGraphData)
  }

  public graphConfig(): IGraphConf {
    return this.graphConf;
  }

  public resizeGraph(): void {
    let parent = document.getElementById(this.chartEntity.id);
    
    if (parent) {      
      this.view = [0, 0];
      this.view.push(parent.offsetWidth, parent.offsetHeight);
    }
  }

  public addData(dataValue: any): void {
    if (!dataValue) return;

    // const value = dataValue.toString();
    const data: GraphValue = {
      name: new Date(Date.now()),
      value: dataValue,
    };
    this.graphValues[0].series.push(data);

    if (!this.lastRecord || dataValue != this.lastRecord) {
      this.lastRecord = dataValue;
      this.updateGraph();
    }

    if (
      this.graphValues[0].series.length >= this.graphConf.defaultRecordsCount
    ) {
      this.graphValues[0].series.splice(0, 1);
    }
  }

  public clearGraph(): void {
    this.graphValues[0].series.splice(0);
    this.updateGraph();
  }

  public updateGraph() {
    this.graphValues = [...this.graphValues];
  }

  public changeChartType(newChartType: SingleChart): void {
    this.changes = {
      chartType: newChartType,
      chartEntity: this.chartEntity,
    };
    this.newChartType.emit(this.changes);
  }

  public backToLive():void{
    console.log(1);
    console.log(this.chartEntity);
    
    if(this.chartEntity.oldChartType!=null){
      this.changeChartType(this.chartEntity.oldChartType);
    }
    else{
      this.dataSub?.unsubscribe();
      this.isGraphCleared = false;
  
       this.dataSub = this.chartEntity.dataEvent.subscribe((data: any) => {
        
        this.ngZone.run(() => {
          
          if (!this.isGraphCleared) {
            
            this.clearGraph();
            this.isGraphCleared = true;
          }
          this.addData(data);
          this.cdr.markForCheck();
        });
      });
      this.mode= "live";
    }
   
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
        this.loadLastMinuteData(minutesBack);
      }
    });
   
  } 
  // initialize() {
  //   this.chart = Highcharts.chart(this.chartContainer.nativeElement, {
  //     chart: { type: 'line' },
  //     title: { text: this.item.parameter },
  //     series: this.item.datasets.map(d => ({
  //       type: 'line',
  //       name: `UAV ${d.uavNumber}`,
  //       data: d.data,
  //       color: d.color
  //     }))
  //   });
  // }

  // updateData(uavNumber: number, value: string) {
  //   const series = this.chart.series.find(s => s.name === `UAV ${uavNumber}`);
  //   if (series) {
  //     const numValue = parseFloat(value);
  //     series.addPoint(numValue, true, series.data.length >= 10);
  //   }
  // }

  // removeSeries(uavNumber: number) {
  //   const series = this.chart.series.find(s => s.name === `UAV ${uavNumber}`);
  //   if (series) {
  //     series.remove();
  //   }
  // }

  // recreateChart() {
  //   this.chart.destroy();
  //   this.initialize();
  // }

  public loadLastMinuteData(minutes:number): void {
    // console.log(
    //   '[1] Load triggered, chartEntities:',
    //   this.chartEntities,
    //   'chartEntity:',
    //   this.chartEntity
    // );
    this.mode = 'shift'

    console.log(minutes);
    
    const pageNumber = 1;

    const now = new Date();
    const past = new Date(now.getTime() - minutes * 60 * 1000);

    // if (this.chartEntities && this.chartEntities.length > 0) {
    //   console.log('[3] Handling multiple entities case');
      
    //   const req: ArchiveManyRequestDto = {
    //     StartDate: oneMinuteAgo,
    //     EndDate: now,
    //     UavNumbers: this.chartEntities.map((e) => e.parameter.uavNumber),
    //     Communication: this.chartEntities[0].parameter.communication,
    //     PageNumber: pageNumber,
    //     PageSize: pageSize,
    //     ParameterNames: [this.chartEntities[0].parameter.parameterName],
    //   };

    //   console.log('[4] Sending multi-entity request:', req);

    //   this._archiveService.getMultiArchiveData(req).subscribe({
    //     next: (result) => {
    //       console.log('[5] Multi-entity response:', result);
    //       console.log('[6] Raw packets:', result.archiveDataPackets);

    //       this.graphValues = this.chartEntities!.map((entity) => {
    //         const converted = this.convertApiPacketsToArchiveData(
    //           result.archiveDataPackets,
    //           entity.parameter.parameterName
    //         );
    //         console.log(
    //           `[7] Processed data for ${entity.parameter.parameterName}:`,
    //           converted
    //         );
    //         return {
    //           name: entity.parameter.parameterName,
    //           series: converted,
    //         };
    //       });

    //       console.log('[8] Final graphValues:', this.graphValues);
    //       this.cdr.markForCheck();
    //     },
    //     error: (err) => {
    //       console.error('Request failed:', err);
    //     },
    //     complete: () => {
    //       console.log('Request complete.');
    //     },
    //   });
    // }
     if (this.chartEntity) {
      console.log('[10] Handling single entity case');


      const req: ArchiveManyRequestDto = {
        StartDate: past,
        EndDate: now,
        UavNumbers: [this.chartEntity.parameter.uavNumber],
        Communication: this.chartEntity.parameter.communication,
        PageNumber: pageNumber,
        PageSize: 14*60*minutes,
        ParameterNames: [this.chartEntity.parameter.parameterName],
      };

      console.log('[11] Sending single-entity request:', req);

      this._archiveService.getMultiArchiveData(req).subscribe({
        next: (result) => {
        console.log('[12] Single-entity response:', result);

        const responseData = Array.isArray(result) ? result[0] : result;
        const rawPackets = responseData?.archiveDataPackets || [];  

        const paramName = this.chartEntity!.parameter.parameterName;
        const converted = this.convertApiPacketsToArchiveData(
          rawPackets,
          paramName
        );
        
        console.log('[14] Processed data:', converted);
        
        this.graphValues = [{
          name: paramName,
          series: converted
        }];
        
        console.log('[15] Final graphValues:', this.graphValues);
        this.cdr.markForCheck();
        this.mode=="shift";
        console.log(this.mode);
        
        },
        error: (err) => {
          console.error('Request failed:', err);
        },
        complete: () => {
          console.log('Request complete.');
        },
      });
    }
  }

  private convertApiPacketsToArchiveData(
    packets: any[],
    parameterName: string
  ): GraphValue[] {
    const filtered = packets.filter(p => 
      p.parameters && p.parameters[parameterName] !== undefined
    );
    
    console.log(`[17] Filtered ${filtered.length}/${packets.length} packets for ${parameterName}`);
    
    return filtered.map((p) => {
      const numericValue = +p.parameters[parameterName]; // Convert to number
      if (isNaN(numericValue)) {
        console.warn(`[18] Invalid number value for ${parameterName}:`, p.parameters[parameterName]);
      }
      return {
        name: new Date(p.dateTime),
        value: numericValue.toString()
      };
    });
  }
}
