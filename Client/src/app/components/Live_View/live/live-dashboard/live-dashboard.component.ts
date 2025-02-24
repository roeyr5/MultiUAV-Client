import { Component } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridType } from 'angular-gridster2';
import { ChartGridsterItem } from 'src/app/models/chartitem';

@Component({
  selector: 'app-live-dashboard',
  templateUrl: './live-dashboard.component.html',
  styleUrls: ['./live-dashboard.component.css']
})
export class LiveDashboardComponent {
  
  // @ViewChildren(ChartComponent) charts!: QueryList<ChartComponent>;

  public options: GridsterConfig = {};
  public dashboard: ChartGridsterItem[] = [];

  public isSideBarOpen: boolean = false;

  graphOptions: any[] = [
    { label: 'line', image: 'assets/images/line_chart_icon.png' },
    { label: 'bar', image: 'assets/images/bar_chart_icon.png' },
    { label: 'pie', image: 'assets/images/pie_chart_icon.png' },
    { label: 'gauge', image: 'assets/images/gauge_chart_icon.png' },
    { label: 'area', image: 'assets/images/area_chart_icon.png' },

  ];


  public toggleParameterSidebar(): void {
    this.isSideBarOpen = !this.isSideBarOpen;
  }

    public ngOnInit(): void {
        // this.StartConnection();
        this.InitGridsterOptions();
    }
    private InitGridsterOptions(): void {
      this.options = {
        gridType: GridType.Fit,
        compactType: 'none',
        margin: 10,
        outerMargin: true,
        mobileBreakpoint: 640,
        minCols: 1,
        maxCols: 10,
        minRows: 1,
        maxRows: 10,
        draggable: { enabled: false },
        resizable: { enabled: false },
        displayGrid: DisplayGrid.Always,
      };
  
    }

    private ChangedOptions() {
      if (this.options.api && this.options.api.optionsChanged) {
        this.options.api.optionsChanged();
      }
    }
    public MoveParameters(){
      this.options.draggable ={enabled : true};
      this.options.resizable = {enabled : true};
      this.ChangedOptions();
    }

    public changeChartType(item: ChartGridsterItem, newType: any): void {
      // item.chartType = newType.label; 
      // console.log(newType.label)
      // const chart = this.charts.toArray()[this.dashboard.indexOf(item)];
      // if (chart) {
      //   // chart.updateChartType(newType.label);  
      // } else {
      //   console.warn('Chart instance not found for item:', item);
      // }
    }

    // public changeChartType(item: ChartGridsterItem, newType: any): void {
    //   item.chartType = newType.label; 
    //   console.log(newType.label)
    //   const chart = this.charts.toArray()[this.dashboard.indexOf(item)];
    //   if (chart) {
    //     // chart.updateChartType(newType.label);  
    //   } else {
    //     console.warn('Chart instance not found for item:', item);
    //   }
    // }
}
