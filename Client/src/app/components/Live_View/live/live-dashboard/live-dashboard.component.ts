import { AfterViewChecked, ChangeDetectorRef, Component, EventEmitter, NgZone, Output, QueryList, ViewChild, ViewChildren,  } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridType } from 'angular-gridster2';
import { GridsterBlockComponent } from 'src/app/components/generic-components/chart-entity/charts-types/gridster-block/gridster-block.component';
import { ChartType } from 'src/app/entities/enums/chartType.enum';
import { IcdParameter } from 'src/app/entities/IcdParameter';
import { ChartGridsterItem } from 'src/app/entities/models/chartitem';
import { SignalRService } from 'src/app/services/signalr.service';
import { SimulatorService } from 'src/app/services/simulator.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-live-dashboard',
  templateUrl: './live-dashboard.component.html',
  styleUrls: ['./live-dashboard.component.css'],
})
export class LiveDashboardComponent implements AfterViewChecked{
  constructor(
    private simulatorservice: SimulatorService,
    private userservice: UserService,
    private liveTelemetryData : SignalRService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }
  
  // @ViewChildren(ChartComponent) charts!: QueryList<ChartComponent>;

  protected uavsList: number[] = [];
  protected parametersMap: Map<string, string[]> = new Map<string, string[]>();
  protected selectedParametersMap: Map<number, Map<string, string[]>> = new Map<number,Map<string, string[]>>();

  public groupsJoined: string[] = [];

  public options: GridsterConfig = {};
  public dashboard: ChartGridsterItem[] = [];
  @ViewChildren(GridsterBlockComponent) gridsterBlocks!: QueryList<GridsterBlockComponent>;


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
    this.initGridsterOptions();
    this.startConnection();
  }

  private startConnection() :void{
    this.liveTelemetryData.startConnection().subscribe((response)=>{
      console.log("worked signalR");

      this.liveTelemetryData.receiveMessage().subscribe((message) => {
        console.log("Received message:", message);
        
        const parameterMap = message.message; 
        const uavName = message.uavName;
        this.updateChartData(parameterMap,uavName);
      });
    });
  }

  onChartDataUpdated(event: any) {
    console.log('Chart data was updated');
  }

   private updateChartData(parameterMap: { [key: string]: string }, incomingFullUavName: string): void {
    this.dashboard.forEach((item) => {

      const datasetForThisUAV = item.datasets.find(ds => `${ds.uavNumber}${item.communication}` === incomingFullUavName);

      if (!datasetForThisUAV) return;
  
      if (parameterMap[item.parameter] !== undefined) {
        const newValue = parseFloat(parameterMap[item.parameter]);
        const newLabel = new Date().toLocaleTimeString();

        datasetForThisUAV.data.push(newValue);
        item.chartLabels.push(newLabel);
        
        if (datasetForThisUAV.data.length >= 10)
          datasetForThisUAV.data.shift();
        if (item.chartLabels.length >= 10)
          item.chartLabels.shift();

       const blockComponent = this.gridsterBlocks.find(block => block.item === item);
        if (blockComponent) {
          blockComponent.handleNewData();
        } else {
          console.warn('GridsterBlockComponent not found for item:', item);
        }

      }
    });
  }

  // private updateAllCharts() {
  //   gridsterBlockComponent.handleNewData();  
  // }

  private initGridsterOptions(): void {
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

  public onAddParameter(parameter: IcdParameter): void {

    const existingEntry = this.dashboard.find(item => 
      item.communication === parameter.communication && 
      item.parameter === parameter.parameterName
    );

    if (existingEntry) {
      const uavExists = existingEntry.datasets.some(ds => 
        ds.uavNumber === parameter.uavNumber
      );

      if (!uavExists) {
        const newDataset = { 
          uavNumber: parameter.uavNumber, 
          data: [], 
          label: `UAV ${parameter.uavNumber}`, 
          color: this.getRandomColor() 
        };
        existingEntry.datasets.push(newDataset);
        
        this.updateChartForGraph(existingEntry);
        this.liveTelemetryData.addParameter(parameter);
        this.joinGroup(parameter);
      }
      return;
    }

    const uavData = [
      { uavNumber: parameter.uavNumber, data: [], label: `UAV ${parameter.uavNumber}`, color: 'red' }
    ];
  
    const newChart = {
       x: 0,
       y: 0,
       rows: 1,
       cols: 1,
       chartType: ChartType.Graph,
       chartLabels: [],
       communication: parameter.communication,
       parameter: parameter.parameterName,
       datasets: uavData,
       showOptions: false,
       dataevent: new EventEmitter<boolean>(),
    };  

    this.dashboard.push(newChart);
    this.liveTelemetryData.addParameter(parameter);
    this.joinGroup(parameter);
  
    console.log('Dashboard:', this.dashboard);
    console.log('Parameter:', parameter);
  }
  
  private updateChartForGraph(item: ChartGridsterItem) {
    item.chartLabels = [...item.chartLabels];
    item.datasets = [...item.datasets];
    
    const blockComponent = this.gridsterBlocks.find(block => block.item === item);
    if (blockComponent) {
      blockComponent.handleNewData();
    }
  }
  
  protected trackByFn(index: number, item: any): any {
    return item.communication+item.parameter ;
  }

  public onRemoveParameter(parameter: IcdParameter): void {
    const existingEntry = this.dashboard.find(item => 
      item.communication === parameter.communication && 
      item.parameter === parameter.parameterName
    );
  
    if (existingEntry) {
      existingEntry.datasets = existingEntry.datasets.filter(
        ds => ds.uavNumber !== parameter.uavNumber
      );
  
      if (existingEntry.datasets.length === 0) {
        this.dashboard = this.dashboard.filter(item => 
          item !== existingEntry
        );
      }
      
      this.liveTelemetryData.removeParameter(parameter);
      this.updateChartForGraph(existingEntry);
    }
  

  }
  
  public joinGroup(parameter:IcdParameter): void {

    const groupName = `${parameter.uavNumber}${parameter.communication}`;
    console.log(groupName);

    if(this.groupsJoined.includes(groupName))
        return;

    this.liveTelemetryData.joinGroup(groupName).subscribe({
      next: () => console.log(`Joined group: ${groupName}`),
      error: (err) => console.error('Error joining group', err),
    });
  }
  private getRandomColor(): string {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
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
