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
import { ChartGridsterItem } from 'src/app/entities/models/chartitem';
import {
  graphEntity,
  IChartEntity,
  IGridsterParameter,
} from 'src/app/entities/models/IChartEntity';
('');
import { ChangeChartType } from 'src/app/entities/enums/chartType.enum';
import { SingleChart } from 'src/app/entities/enums/chartType.enum';
import { gaugeChartTypes } from 'src/app/entities/enums/chartType.enum';
import { pieChartTypes } from 'src/app/entities/enums/chartType.enum';

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

  changes!:ChangeChartType
  @Output() newChartType = new EventEmitter<ChangeChartType>();
  @Input() chartEntity!: IChartEntity;
  public view: [number, number] = [0, 0];
  public graphValues: GraphRecordsList[] = [];
  public isGraphCleared: boolean = false;
  // public readonly MAX_MS_WITHOUT_UPDATE = 5000;
  private lastRecord: Number = 0;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngAfterViewInit(): void {
    this.updateGraphSize();
  }

  public graphConf: IGraphConf = new IGraphConf();
  public graphValue: number = 0;
  // public size: number = 120;

  @ViewChild('graph', { static: false }) graph!: ElementRef;

  ngOnInit(): void {
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

    this.chartEntity.dataEvent.subscribe((data: any) => {
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
}
