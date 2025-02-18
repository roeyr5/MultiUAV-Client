// import { Component, OnInit } from '@angular/core';
// import { GridsterItem,GridsterConfig, DisplayGrid, GridType } from 'angular-gridster2';

// @Component({
//   selector: 'app-test',
//   templateUrl: './test.component.html',
//   styleUrls: ['./test.component.css']
// })
// export class TestComponent implements OnInit{

//   // constructor(options: GridsterConfig){}
//   options: GridsterConfig ={};
//   dashboard: Array<GridsterItem> =[];

//   ngOnInit() {
//     this.options = {
//       gridType: GridType.Fit, // Other options: 'ScrollVertical', 'ScrollHorizontal', 'Fixed'
//       compactType: 'none', // Options: 'compactUp', 'compactLeft', 'none'
//       margin: 10,
//       outerMargin: true,
//       outerMarginTop: null,
//       outerMarginRight: null,
//       outerMarginBottom: null,
//       outerMarginLeft: null,
//       useTransformPositioning: true,
//       mobileBreakpoint: 640,
//       minCols: 1,
//       maxCols: 10,
//       minRows: 1,
//       maxRows: 10,
//       maxItemCols: 5,
//       minItemCols: 1,
//       maxItemRows: 5,
//       minItemRows: 1,
//       maxItemArea: 25,
//       minItemArea: 1,
//       defaultItemCols: 2,
//       defaultItemRows: 2,
//       fixedColWidth: 105,
//       fixedRowHeight: 105,
//       keepFixedHeightInMobile: false,
//       keepFixedWidthInMobile: false,
//       scrollSensitivity: 10,
//       scrollSpeed: 20,
//       enableEmptyCellClick: false,
//       enableEmptyCellContextMenu: false,
//       enableEmptyCellDrop: false,
//       enableEmptyCellDrag: false,
//       emptyCellDragMaxCols: 50,
//       emptyCellDragMaxRows: 50,
//       ignoreMarginInRow: false,
//       draggable: {
//         enabled: true,
//       },
//       resizable: {
//         enabled: true,
//       },
//       swap: false,
//       pushItems: true,
//       disablePushOnDrag: false,
//       disablePushOnResize: false,
//       disableAutoPositionOnConflict: false,
//       api: {},
//       displayGrid: DisplayGrid.Always, // Options: 'Always', 'OnDrag&Resize', 'None'
//       disableWindowResize: false,
//       disableWarnings: false,
//       scrollToNewItems: false,
//     };

//     this.dashboard = [
//       { cols: 2, rows: 1, y: 0, x: 0 },
//       { cols: 2, rows: 2, y: 0, x: 2 },
//       { cols: 1, rows: 1, y: 2, x: 0 },
//       { cols: 1, rows: 1, y: 2, x: 1 },
//       { cols: 2, rows: 1, y: 2, x: 2 },
//     ];
//   }

//   changedOptions() {
//     if (this.options.api && this.options.api.optionsChanged) {
//       this.options.api.optionsChanged();
//     }
//   }

//   // removeItem(item) {
//   //   this.dashboard.splice(this.dashboard.indexOf(item), 1);
//   // }

//   // addItem() {
//   //   this.dashboard.push({});
//   // }

//   static itemChange(item :GridsterItem, itemComponent :any) {
//     console.info('itemChanged', item, itemComponent);
//   }

//   static itemResize(item :GridsterItem, itemComponent :any) {
//     console.info('itemResized', item, itemComponent);
//   }
// }


import { Component } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip
} from "ng-apexcharts";
import { dataSeries } from "../../dto/dataseries";

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  public series!: ApexAxisChartSeries;
  public chart!: ApexChart;
  public dataLabels!: ApexDataLabels;
  public markers!: ApexMarkers;
  public title!: ApexTitleSubtitle;
  public fill!: ApexFill;
  public yaxis!: ApexYAxis;
  public xaxis!: ApexXAxis;
  public tooltip!: ApexTooltip;

  constructor() {
    this.initChartData();
  }

  public initChartData(): void {
    let ts2 = 1484418600000;
    let dates = [];
    for (let i = 0; i < 120; i++) {
      ts2 = ts2 + 86400000;
      dates.push([ts2, dataSeries[1][i].value]);
    }

    this.series = [
      {
        name: "XYZ MOTORS",
        data: dates
      }
    ];
    this.chart = {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: "Stock Price Movement",
      align: "left"
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: function(val) {
          return (val / 1000000).toFixed(0);
        }
      },
      title: {
        text: "Price"
      }
    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function(val) {
          return (val / 1000000).toFixed(0);
        }
      }
    };
  }
}
