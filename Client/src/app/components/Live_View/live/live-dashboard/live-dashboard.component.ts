import { Component, Output } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridType } from 'angular-gridster2';
import { ChartGridsterItem } from 'src/app/entities/models/chartitem';
import { SimulatorService } from 'src/app/services/simulator.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-live-dashboard',
  templateUrl: './live-dashboard.component.html',
  styleUrls: ['./live-dashboard.component.css'],
})
export class LiveDashboardComponent {
  constructor(
    private simulatorservice: SimulatorService,
    private userservice: UserService
  ) {}

  // @ViewChildren(ChartComponent) charts!: QueryList<ChartComponent>;

  protected uavsList: number[] = [];
  protected parametersMap: Map<string, string[]> = new Map<string, string[]>();
  protected selectedParametersMap: Map<number, Map<string, string[]>> = new Map<number,Map<string, string[]>>();

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

  public ngOnInit(): void {
    this.getUavs();
    this.getParameters();
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

  public onCloseSideBar(): void {
    this.isSideBarOpen = false;
  }

  public toggleSideBar(): void {
    this.isSideBarOpen = !this.isSideBarOpen;
  }

  public getUavs(): void {
    this.simulatorservice.telemetryUavs().subscribe(
      (res) => {
        console.log('UAVs List:', res);
        this.uavsList = Object.keys(res).map(Number);
      },
      (err) => {
        console.error('Error fetching UAVs list:', err);
      }
    );
  }

  protected getParameters(): void {
    this.userservice.getAllParameters().subscribe(
      (res) => {
        Object.entries(res).forEach(([communication, parameters]) => {
          this.parametersMap.set(communication, parameters);
          this.uavsList.forEach((uav) => {
            if (!this.selectedParametersMap.has(uav)) {
              this.selectedParametersMap.set(uav, new Map<string, string[]>());
            }
            this.selectedParametersMap.get(uav)?.set(communication, []);
          });
        });
        console.log('Parameters Map:', this.parametersMap);
      },
      (err) => {
        console.error('error :', err);
      }
    );
  }

  public MoveParameters() {
    this.options.draggable = { enabled: true };
    this.options.resizable = { enabled: true };
    this.ChangedOptions();
  }

  private ChangedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
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
