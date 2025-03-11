import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  NgZone,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { DisplayGrid, GridsterConfig, GridType } from 'angular-gridster2';
import { GridsterBlockComponent } from 'src/app/components/generic-components/chart-entity/charts-types/gridster-block/gridster-block.component';
import { ChartType, SingleChart } from 'src/app/entities/enums/chartType.enum';
import { IcdParameter } from 'src/app/entities/IcdParameter';
import {
  gaugeChartTypes,
  graphChartTypes,
  pieChartTypes,
} from 'src/app/entities/enums/chartType.enum';
import {
  ChartGridsterItem,
  TelemetryGridsterItem,
} from 'src/app/entities/models/chartitem';
import { IChartEntity } from 'src/app/entities/models/IChartEntity';
import { SignalRService } from 'src/app/services/signalr.service';
import { SimulatorService } from 'src/app/services/simulator.service';
import { UserService } from 'src/app/services/user.service';
import { ParameterDataDto } from 'src/app/entities/models/parameterDataDto';

@Component({
  selector: 'app-live-dashboard',
  templateUrl: './live-dashboard.component.html',
  styleUrls: ['./live-dashboard.component.css'],
})
export class LiveDashboardComponent implements AfterViewChecked {
  constructor(
    private simulatorservice: SimulatorService,
    private userservice: UserService,
    private liveTelemetryData: SignalRService,
    private cdRef: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  // @ViewChildren(ChartComponent) charts!: QueryList<ChartComponent>;

  protected uavsList: number[] = [];
  protected parametersMap: Map<string, ParameterDataDto[]> = new Map<
    string,
    ParameterDataDto[]
  >();
  protected selectedParametersMap: Map<
    number,
    Map<string, ParameterDataDto[]>
  > = new Map<number, Map<string, ParameterDataDto[]>>();

  public parametersChartEntityMap: Map<string, IChartEntity> = new Map<
    string,
    IChartEntity
  >();

  public groupsJoined: string[] = [];

  public options: GridsterConfig = {};
  // public dashboard: ChartGridsterItem[] = [];
  public telemetryGridsterDashboard: TelemetryGridsterItem[] = [];
  @ViewChildren(GridsterBlockComponent)
  gridsterBlocks!: QueryList<GridsterBlockComponent>;

  public isSideBarOpen: boolean = false;

  public ngOnInit(): void {
    this.getUavs();
    this.getParameters();
    this.initGridsterOptions();
    this.startConnection();
  }

  private startConnection(): void {
    this.liveTelemetryData.startConnection().subscribe((response) => {
      console.log('worked signalR');

      this.liveTelemetryData.receiveMessage().subscribe((message) => {
        // console.log("Received message:", message);

        const parameterMap = message.message;
        const uavName = message.uavName;
        this.updateChartData(parameterMap, uavName);
      });
    });
  }

  onChartDataUpdated(event: any) {
    // console.log('Chart data was updated');
  }

  // public isParameterExists(): boolean {

  // }

  private updateChartData(
    parameters: { [key: string]: string },
    incomingFullUavName: string
  ): void {
    Object.entries(parameters).forEach(([parameterName, parameterValue]) => {
      let parameterKey = `${parameterName}_${incomingFullUavName}`;
      const chartEntity = this.parametersChartEntityMap.get(parameterKey);
      if (!chartEntity) return;
      chartEntity.dataEvent.emit(parameterValue);
    });

    // Object.entries(parameters).forEach(([parameterName, parameterValue]) => {
    //   const newLabel = new Date().toLocaleTimeString();

    //   const item = this.dashboard.find(
    //     (item) =>
    //       item.parameter === parameterName &&
    //       item.uavNames.includes(incomingFullUavName)
    //   );
    //   if (!item) return;
    //   console.log(item);
    //   const datasetForThisUAV = item.datasets.find(
    //     (ds) => `${ds.uavNumber}${item.communication}` === incomingFullUavName
    //   );
    //   if (!datasetForThisUAV) return;

    //   if (item.units === 'Value' || item.chartType === 'solidgauge') {
    //     datasetForThisUAV.data = [parameterValue];
    //   } else {
    //     const numValue = parseFloat(parameterValue);

    //     datasetForThisUAV.data.push(numValue);
    //     item.chartLabels.push(newLabel);

    //     if (datasetForThisUAV.data.length > 10) {
    //       datasetForThisUAV.data.shift();
    //     }
    //     if (item.chartLabels.length > 10) {
    //       item.chartLabels.shift();
    //     }
    //   }

    //   const blockComponent = this.gridsterBlocks.find(
    //     (block) => block.item === item
    //   );
    //   if (blockComponent) {
    //     blockComponent.handleNewData(
    //       datasetForThisUAV.uavNumber,
    //       item.communication,
    //       parameterValue
    //     );
    //   } else {
    //     console.warn('GridsterBlockComponent not found for item:', item);
    //   }
    // });
  }

  private updateAllCharts() {
    // gridsterBlockComponent.handleNewData();
  }

  private initGridsterOptions(): void {
    this.options = {
      gridType: GridType.Fit,
      compactType: 'none',
      margin: 5,
      outerMargin: true,
      mobileBreakpoint: 640,
      minCols: 2,
      maxCols: 12,
      minRows: 2,
      maxRows: 12,
      draggable: { enabled: true },
      resizable: { enabled: true },
      displayGrid: DisplayGrid.Always,
      pushItems: true,
      swap: true,
      scrollToNewItems: true,
    };
  }

  public onCloseSideBar(): void {
    this.isSideBarOpen = false;
  }

  public toggleSideBar(): void {
    this.isSideBarOpen = !this.isSideBarOpen;
  }

  public onAddParameter(parameter: IcdParameter): void {
    const chartType: SingleChart =
      parameter.units === 'Value' ? SingleChart.LABEL : SingleChart.GAUGE;
    let itemToAdd: IChartEntity = new IChartEntity(
      parameter,
      chartType,
      new EventEmitter<any>()
    );
    const existingItem = this.telemetryGridsterDashboard.find(
      (item) =>
        item.parameterComm === parameter.communication &&
        item.parameterName === parameter.parameterName
    );

    if (existingItem) {
      const uavExists = existingItem.chartEntitys.some(
        (chartEntity) => chartEntity.parameter.uavNumber === parameter.uavNumber
      );

      if (!uavExists) {
        existingItem.chartEntitys.push(itemToAdd);
      }

      // const newDataset = {
      //   uavNumber: parameter.uavNumber,
      //   data: [],
      //   label: `UAV ${parameter.uavNumber}`,
      //   color: this.getRandomColor(),
      //   marker: { enabled: false },
      // };
      // existingItem.datasets.push(newDataset);

      // this.updateChartForGraph(existingItem);
      // this.liveTelemetryData.addParameter(parameter);
    } else {
      this.telemetryGridsterDashboard.push({
        cols: 1,
        rows: 1,
        x: 0,
        y: 0,
        parameterComm: parameter.communication,
        parameterName: parameter.parameterName,
        chartEntitys: [itemToAdd],
      });
    }

    // const uavData = [
    //   {
    //     uavNumber: parameter.uavNumber,
    //     data: [],
    //     label: `UAV ${parameter.uavNumber}`,
    //     color: 'red',
    //   },
    // ];

    // const newChart = {
    //   x: 0,
    //   y: 0,
    //   rows: 1,
    //   cols: 1,
    //   chartType: chartType,
    //   chartLabels: [],
    //   uavNames: [parameter.uavNumber + parameter.communication],
    //   communication: parameter.communication,
    //   parameter: parameter.parameterName,
    //   datasets: uavData,
    //   showOptions: false,
    //   units: parameter.units,
    //   InterfaceLimitMax: parameter.InterfaceLimitMax,
    //   InterfaceLimitMin: parameter.InterfaceLimitMin,
    // };

    // this.dashboard.push(newChart);

    this.parametersChartEntityMap.set(
      `${parameter.parameterName}_${parameter.uavNumber}${parameter.communication}`,
      itemToAdd
    );
    this.liveTelemetryData.addParameter(parameter);
    this.joinGroup(parameter);
  }

  private updateChartForGraph(item: ChartGridsterItem) {
    item.chartLabels = [...item.chartLabels];
    item.datasets = [...item.datasets];
    item.uavNames = [...item.uavNames];

    // const blockComponent = this.gridsterBlocks.find(block => block.item === item);
    // if (blockComponent) {
    //   // blockComponent.handleNewData(item.uavn, item.communication, item.parameter); // Update with new datasets and communication
    // }
  }
  // blockComponent.handleNewData(datasetForThisUAV.uavNumber, item.communication, parameterName);

  protected trackByFn(index: number, item: any): any {
    return item.communication + item.parameter;
  }

  public onRemoveParameter(parameter: IcdParameter): void {
    const existingEntry = this.dashboard.find(
      (item) =>
        item.communication === parameter.communication &&
        item.parameter === parameter.parameterName
    );
    if (!existingEntry) return;

    const fullUavName = `${parameter.uavNumber}${parameter.communication}`;

    existingEntry.uavNames = existingEntry.uavNames.filter(
      (name) => name !== fullUavName
    );

    const removedDataset = existingEntry.datasets.find(
      (ds) => ds.uavNumber === parameter.uavNumber
    );
    existingEntry.datasets = existingEntry.datasets.filter(
      (ds) => ds.uavNumber !== parameter.uavNumber
    );

    const blockComponent = this.gridsterBlocks.find(
      (block) => block.item === existingEntry
    );

    if (blockComponent && removedDataset) {
      // blockComponent.removeSpecificSeries(removedDataset.uavNumber);
    }

    // const isParameterStillUsed = this.dashboard.some(item =>
    //   item.communication === parameter.communication &&
    //   item.uavNames.some(uav => uav === fullUavName)
    // );

    if (existingEntry.uavNames.length === 0) {
      this.dashboard = this.dashboard.filter((item) => item !== existingEntry);
      this.liveTelemetryData.leaveGroup(fullUavName).subscribe();
    }

    this.liveTelemetryData.removeParameter(parameter);
  }

  public shouldShowChart(item: ChartGridsterItem): boolean {
    return item.units !== 'Value';
  }
  public joinGroup(parameter: IcdParameter): void {
    const groupName = `${parameter.uavNumber}${parameter.communication}`;
    console.log(groupName);

    if (this.groupsJoined.includes(groupName)) return;

    this.liveTelemetryData.joinGroup(groupName).subscribe({
      next: () => console.log(`Joined group: ${groupName}`),
      error: (err) => console.error('Error joining group', err),
    });
  }
  private getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
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
              this.selectedParametersMap.set(
                uav,
                new Map<string, ParameterDataDto[]>()
              );
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

  public changeChartType(item: ChartGridsterItem, newType: ChartType): void {
    // item.chartType = newType;
    const blockComponent = this.gridsterBlocks.find(
      (block) => block.item === item
    );
    if (blockComponent) {
      // blockComponent.recreateChart();
    }
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
