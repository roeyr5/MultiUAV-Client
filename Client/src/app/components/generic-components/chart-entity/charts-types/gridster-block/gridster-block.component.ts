import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  Output,
  EventEmitter,
  NgZone,
  inject,
  AfterViewInit,
} from '@angular/core';
// import {
//   ChartGridsterItem,
//   Dataset,
// } from '../../../../../entities/models/chartitem';
import * as Highcharts from 'highcharts';
import 'highcharts/highcharts-more';
import 'highcharts/modules/solid-gauge';
import 'highcharts/modules/accessibility';
import {
  ChartType,
  gaugeChartTypes,
  graphChartTypes,
  pieChartTypes,
  SingleChart,
  ChangeChartType,
  GetTimeShift,
} from 'src/app/entities/enums/chartType.enum';
import {
  IChartEntity,
  IGridsterParameter,
} from 'src/app/entities/models/IChartEntity';

@Component({
  selector: 'app-gridster-block',
  templateUrl: './gridster-block.component.html',
  styleUrls: ['./gridster-block.component.css'],
})
export class GridsterBlockComponent implements OnInit {
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

  public chartId: string = '';
  public selectedChartType: any;
  ngZone = inject(NgZone);

  @Input() chartEntity!: IChartEntity;
  @Output() updateChange = new EventEmitter<boolean>();
  @Output() chartDataUpdated = new EventEmitter<ChangeChartType>();
  @Output() timeShiftUpdate = new EventEmitter<GetTimeShift>();

  changes!: ChangeChartType;
  getTimeShift!: GetTimeShift;

  chart: Highcharts.Chart | undefined;
  chartOptions: Highcharts.Options = {};

  constructor() {}

  ngOnInit(): void {
    // console.log('chartEntity', this.chartEntity);

    this.chartId = `chart-container-${Math.random().toString(36).substr(2, 9)}`;
  }
  public getTypes() {
    return SingleChart;
  }

  public onChangeChart(newChartType: ChangeChartType): void {
    this.changes = {
      chartType: newChartType.chartType,
      chartEntity: this.chartEntity,
    };
    this.chartDataUpdated.emit(this.changes);
  }

  public onTimeShiftRequest(timeShiftMode: GetTimeShift): void {
    
    this.getTimeShift = {
      minutesBack: timeShiftMode.minutesBack,
      newChartType: timeShiftMode.newChartType,
      oldChartType: timeShiftMode.oldChartType,
      chartEntity: timeShiftMode.chartEntity,
    };
    this.timeShiftUpdate.emit(this.getTimeShift);
  }

  // public changeChartType(newChartType: SingleChart): void {
  //   this.changes = {
  //     chartType: newChartType,
  //     chartEntity: this.chartEntity,
  //   };
  //   this.chartDataUpdated.emit(this.changes);
  // }

  // public onChartTypeChange(){

  // this.changes = {
  //   chartType: this.selectedChartType,
  //   chartEntity: this.chartEntity,
  // };

  //   this.chartDataUpdated.emit(this.changes)
  // }

  //   createChart() {
  //     this.chartOptions = {
  //       title: {
  //         text: this.item.parameter,
  //       },
  //       xAxis: {
  //         categories: this.item.chartLabels,
  //       },
  //       yAxis: {
  //         min: this.item.InterfaceLimitMax,
  //         max: this.item.InterfaceLimitMax,
  //       },
  //       accessibility: {
  //         enabled: false,
  //       },
  //       series: this.item.datasets.map(dataset => ({
  //         type: this.item.chartType,
  //         width: '100%',
  //         height: '100%',
  //         backgroundColor: 'transparent',
  //         animation: false ,
  //         name: `UAV ${dataset.uavNumber}`,
  //         data: [dataset.data],
  //         color: dataset.color,
  //         marker: {
  //           enabled: false,
  //         },
  //       })) as Highcharts.SeriesOptionsType[],

  //       responsive: {
  //         rules: [{
  //           condition: {
  //             maxWidth: 500,
  //           },
  //           chartOptions: {
  //             legend: {
  //               layout: 'horizontal',
  //               align: 'center',
  //               verticalAlign: 'bottom',
  //             },
  //           },
  //         }],
  //       },
  //     };

  //     this.chart = Highcharts.chart(this.chartId, this.chartOptions);

  //   }

  //   handleNewData(uavNumber: number, communication:string,parameter:string) {
  //     this.updateChart(uavNumber,communication,parameter);
  //     this.chartDataUpdated.emit();
  //   }

  // public removeSpecificSeries(uavNumber: number): void {
  //   if (!this.chart) return;

  //   const seriesName = `UAV ${uavNumber}`;
  //   const seriesIndex = this.chart.series.findIndex(s => s.name === seriesName);

  //   if (seriesIndex !== -1) {
  //     this.chart.series[seriesIndex].remove();
  //     this.updateXAxisLabels();
  //   }
  // }

  // private updateXAxisLabels(): void {
  //   if (this.chart?.xAxis[0]) {
  //     this.chart.xAxis[0].update({
  //       categories: this.item.chartLabels
  //     });
  //   }
  // }

  // public recreateChart(): void {
  //   if (this.chart) {
  //     this.chart.destroy();
  //   }
  //   // console.log(1)
  //   this.createChart();
  // }

  // public updateChart(uavNumber:number,communication:string,parameter:string) {

  //   if (!this.chart) {
  //     console.error('Chart is not initialized yet');
  //     return;
  //   }

  //   const foundDataset = this.item.datasets.find(dataset => dataset.uavNumber === uavNumber);

  //   if (foundDataset) {
  //     const seriesName = `UAV ${uavNumber}`;
  //     let series = this.chart.series.find(s => s.name === seriesName);

  //    if (series) {
  //       series.setData([...foundDataset.data], false);
  //     }
  //     else {
  //     this.chart.addSeries({
  //       name: seriesName,
  //       data: [...foundDataset.data],
  //       color: foundDataset.color,
  //       type: this.item.chartType,
  //       marker:{enabled : false}
  //     }, false);
  //   }
  // }

  //  if (this.item.datasets[0].uavNumber === uavNumber) {
  //     if (this.chart.xAxis && this.item.chartLabels.length > 0) {
  //       this.chart.xAxis[0].update({
  //         categories: this.item.chartLabels,
  //       }, false);
  //     }
  //   }

  //   // if (this.chart.xAxis && this.item.chartLabels.length > 0) {
  //   //   console.log('Updating X-Axis Categories:', this.item.chartLabels);
  //   //   this.chart.xAxis[0].update({
  //   //     categories: this.item.chartLabels,
  //   //   }, false);
  //   // }

  //   this.chart.redraw();
  //   this.updateChange.emit(true);
  // }
  //   public changeChartType(chartType: ChartType): void {
  //     this.item.chartType = chartType;
  //     if(this.item.chartType === ChartType.Gauge)
  //     {
  //       this.item.datasets.forEach(dataset => {
  //         dataset.data = [dataset.data[dataset.data.length-1]];
  //       })
  //       this.item.chartLabels = [this.item.chartLabels[this.item.chartLabels.length-1]];
  //     }
  //     console.log(this.item)
  //     this.recreateChart();
  //   }
}
