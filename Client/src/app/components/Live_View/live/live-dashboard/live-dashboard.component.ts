import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  NgZone,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  DisplayGrid,
  GridsterConfig,
  GridsterItem,
  GridType,
} from 'angular-gridster2';
import { GridsterBlockComponent } from 'src/app/components/generic-components/chart-entity/charts-types/gridster-block/gridster-block.component';
import {
  ChartType,
  SingleChart,
  ChangeChartType,
  GetTimeShift,
} from 'src/app/entities/enums/chartType.enum';
import { IcdParameter } from 'src/app/entities/IcdParameter';
import {
  gaugeChartTypes,
  graphChartTypes,
  pieChartTypes,
} from 'src/app/entities/enums/chartType.enum';
import { TelemetryGridsterItem } from 'src/app/entities/models/chartitem';
import { IChartEntity } from 'src/app/entities/models/IChartEntity';
import { SignalRService } from 'src/app/services/signalr.service';
import { SimulatorService } from 'src/app/services/simulator.service';
import { UserService } from 'src/app/services/user.service';
import { ParameterDataDto } from 'src/app/entities/models/parameterDataDto';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import {
  createPresetDto,
  PresetItem,
} from 'src/app/entities/models/presetItem';
import { stringify, parse } from 'flatted';
import { GridsterItems } from 'src/app/entities/models/presetItem';
import { InsideParameterDTO } from 'src/app/entities/models/addParameter';
import { ToastrService } from 'ngx-toastr';

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
    private ngZone: NgZone,
    private toastrService: ToastrService
  ) {}

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  // @ViewChildren(ChartComponent) charts!: QueryList<ChartComponent>;
  public presetParameters: InsideParameterDTO[] = [];

  @Input() public presetDashboard: PresetItem[] = [];
  @Input() public presetName: string = '';

  protected uavsList: number[] = [6];
  protected parametersMap: Map<string, ParameterDataDto[]> = new Map<
    string,
    ParameterDataDto[]
  >();
  protected selectedParametersMap: Map<
    number,
    Map<string, ParameterDataDto[]>
  > = new Map<number, Map<string, ParameterDataDto[]>>();

  @Input() public parametersChartEntityMap: Map<string, IChartEntity> = new Map<
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

  public async ngOnInit(): Promise<void> {
    await this.startConnection();
    this.getUavs();
    this.getParameters();
    this.initGridsterOptions();
    this.presetBuild();
  }

  private presetBuild(): void {
    console.log('presetName', this.presetName);

    this.buildPresetDahboard(this.presetDashboard);
  }

  private startConnection(): Promise<void> {
    return new Promise((resolve) => {
      this.liveTelemetryData.startConnection().subscribe(() => {
        this.liveTelemetryData.receiveMessage().subscribe((message) => {
          const parameterMap = message.message;
          const uavName = message.uavName;
          this.updateChartData(parameterMap, uavName);
        });
        resolve();
      });
    });
  }

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
  }

  private initGridsterOptions(): void {
    this.options = {
      gridType: GridType.Fit,
      compactType: 'compactUp',
      margin: 5,
      outerMargin: false,
      mobileBreakpoint: 640,
      minCols: 1,
      maxCols: 4,
      minRows: 1,
      maxRows: 4,
      draggable: { enabled: true },
      resizable: { enabled: true },
      displayGrid: DisplayGrid.OnDragAndResize,
      pushItems: true,
      swap: true,
      scrollToNewItems: true,
    };
  }

  public onCloseSideBar(): void {
    this.isSideBarOpen = false;
  }
  public onChangeChart(chartChanges: ChangeChartType): void {
    chartChanges.chartEntity.chartType = chartChanges.chartType;
  }
  public onTimeShiftRequest(timeShiftChanges: GetTimeShift): void {
    timeShiftChanges.chartEntity.chartType = timeShiftChanges.newChartType;
    timeShiftChanges.chartEntity.oldChartType = timeShiftChanges.oldChartType;
    timeShiftChanges.chartEntity.minutesBack = timeShiftChanges.minutesBack;
    console.log(timeShiftChanges);
  }

  public async savePreset(): Promise<void> {
    const email = localStorage.getItem('email');
    if (email !== null) {
      if (this.presetName != 'null') {
        const presetUpdate: createPresetDto = {
          email: email,
          presetName: this.presetName,
          presetItem: this.buildDashboardItemsDto(),
        };

        const { value: saveOption } = await Swal.fire({
          icon: 'question',
          title: `Do you want to save it as "${this.presetName}" or save it as a new one?`,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: `Save as ${this.presetName}`,
          denyButtonText: 'Save as new',
          cancelButtonText: 'Cancel',
        });

        if (saveOption === true) {
          if (this.presetName == null || this.presetName == '') {
            Swal.fire({
              icon: 'error',
              title: 'Empty Preset Name',
              text: 'Please enter a valid name for the preset. It cannot be empty',
            });
            return;
          }
          this.userservice.updatePreset(presetUpdate).subscribe((res) => {
            console.log('Preset updated successfully', res);

            Swal.fire({
              icon: 'success',
              title: res.message,
              text: res.message,
            });
          });
        } else if (saveOption === false) {
          const { value: presetName } = await Swal.fire({
            title: 'Input preset name',
            input: 'text',
            inputLabel: 'Your preset name for this mission',
            inputPlaceholder: 'Enter your preset name ',
          });

          const presetCreate: createPresetDto = {
            email: email,
            presetName: presetName,
            presetItem: this.buildDashboardItemsDto(),
          };

          if (presetName == null || presetName == '') {
            Swal.fire({
              icon: 'error',
              title: 'Empty Preset Name',
              text: 'Please enter a valid name for the preset. It cannot be empty',
            });
            return;
          }

          this.userservice.createPreset(presetCreate).subscribe(
            (res) => {
              // console.log("Preset created successfully", res);
              console.log(res);

              if (res.statusCode == 200) {
                Swal.fire({
                  icon: 'success',
                  title: res.message,
                  text: res.message,
                });
              }
            },
            (error) => {
              if (error.status == 300) {
                Swal.fire({
                  icon: 'info',
                  title: error.error.message,
                  text: error.error.message,
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: 'An error occurred',
                  text: error.message,
                });
              }
            }
          );
        } else {
          console.log('User cancelled the action.');
        }
      } else {
        const { value: presetName } = await Swal.fire({
          title: 'Input preset name',
          input: 'text',
          inputLabel: 'Your preset name for this mission',
          inputPlaceholder: 'Enter your preset name ',
        });

        if (!presetName) {
          Swal.fire({
            icon: 'error',
            title: 'Empty Preset Name',
            text: 'Please enter a valid name for the preset. It cannot be empty',
          });
          return;
        }
        if (presetName == null || presetName == '') {
          Swal.fire({
            icon: 'error',
            title: 'Empty Preset Name',
            text: 'Please enter a valid name for the preset. It cannot be empty',
          });
          return;
        }

        const presetCreate: createPresetDto = {
          email: email,
          presetName: presetName,
          presetItem: this.buildDashboardItemsDto(),
        };

        if (presetName == null || presetName == '') {
          Swal.fire({
            icon: 'error',
            title: 'Empty Preset Name',
            text: 'Please enter a valid name for the preset. It cannot be empty',
          });
          return;
        }

        this.userservice.createPreset(presetCreate).subscribe(
          (res) => {
            if (res.statusCode == 200) {
              Swal.fire({
                icon: 'success',
                title: res.message,
                text: res.message,
              });
            }
          },
          (error) => {
            if (error.status == 300) {
              console.log(error);
              Swal.fire({
                icon: 'info',
                title: error.error.message,
                text: error.error.message,
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'An error occurred',
                text: error.message,
              });
            }
          }
        );
      }
    }
  }

  public buildDashboardItemsDto(): PresetItem[] {
    let dashboardItemsDto: PresetItem[] = [];
    for (const item of this.telemetryGridsterDashboard) {
      let dashboardItem: PresetItem = {
        cols: item.cols,
        rows: item.rows,
        y: item.y,
        x: item.x,
        communication: item.parameterComm,
        isConcat: item.isConcatenated,
        parameterName: item.parameterName,
        telemetryItems: this.buildDashboardItemsChart(item.chartEntitys),
      };
      dashboardItemsDto.push(dashboardItem);
    }
    return dashboardItemsDto;
  }

  public buildDashboardItemsChart(
    chartEntitys: IChartEntity[]
  ): GridsterItems[] {
    let gridsterChartItems: GridsterItems[] = [];
    for (const chartEntity of chartEntitys) {
      let girdsterChartItem: GridsterItems = {
        chartType: chartEntity.chartType,
        parameter: chartEntity.parameter,
      };
      gridsterChartItems.push(girdsterChartItem);
    }
    return gridsterChartItems;
  }

  public toggleSideBar(): void {
    this.isSideBarOpen = !this.isSideBarOpen;
  }

  public onAddParameter(parameter: InsideParameterDTO): void {
    const currentMaxCol = Math.max(
      ...this.telemetryGridsterDashboard.map((item) => item.x + item.cols)
    );

    const currentMaxRow = Math.max(
      ...this.telemetryGridsterDashboard.map((item) => item.y + item.rows)
    );

    console.log(currentMaxCol);
    console.log(currentMaxRow);
    
    if (this.telemetryGridsterDashboard.length >= 16) {
      Swal.fire({
        icon: 'error',
        title: 'Limit Reached',
        text: 'You can add a maximum of 16 parameters.',
      });
      return;
    }

    const id = uuidv4();

    let itemToAdd: IChartEntity = new IChartEntity(
      id,
      parameter.parameter,
      parameter.chartType,
      new EventEmitter<any>()
    );

    const existingItem = this.telemetryGridsterDashboard.find(
      (item) =>
        item.parameterComm === parameter.parameterComm &&
        item.parameterName === parameter.parameterName
    );

    if (existingItem) {
      const uavExists = existingItem.chartEntitys.some(
        (chartEntity) =>
          chartEntity.parameter.uavNumber === parameter.parameter.uavNumber
      );

      if (!uavExists) {
        existingItem.chartEntitys.push(itemToAdd);
      }
    } else {
      this.telemetryGridsterDashboard.push({
        cols: parameter.cols,
        rows: parameter.rows,
        x: parameter.x,
        y: parameter.x,
        parameterComm: parameter.parameterComm,
        parameterName: parameter.parameterName,
        chartEntitys: [itemToAdd],
        isConcatenated: false,
        isArchive: false,
      });
    }

    this.parametersChartEntityMap.set(
      `${parameter.parameterName}_${parameter.parameter.uavNumber}${parameter.parameter.communication}`,
      itemToAdd
    );
    this.liveTelemetryData.addParameter(parameter.parameter);
    this.joinGroup(parameter.parameter);
  }

  protected trackByFn(index: number, item: any): any {
    return item.communication + item.parameter;
  }

  public onRemoveParameter(parameter: IcdParameter): void {
    let existingItem = this.telemetryGridsterDashboard.find(
      (item) =>
        item.parameterComm === parameter.communication &&
        item.parameterName === parameter.parameterName
    );

    if (existingItem) {
      existingItem.chartEntitys = existingItem.chartEntitys.filter(
        (chartEntity) => chartEntity.parameter.uavNumber !== parameter.uavNumber
      );

      if (existingItem.chartEntitys.length === 0) {
        this.telemetryGridsterDashboard =
          this.telemetryGridsterDashboard.filter(
            (item) => item !== existingItem
          );
      }
    }

    const mapKey = `${parameter.parameterName}_${parameter.uavNumber}${parameter.communication}`;
    this.parametersChartEntityMap.delete(mapKey);

    this.liveTelemetryData.removeParameter(parameter);
  }

  private buildPresetDahboard(presetItems: PresetItem[]) {
    const arr: InsideParameterDTO[] = [];
    presetItems.forEach((item) => {
      item.telemetryItems.forEach((element) => {
        let InsideParameter: InsideParameterDTO = {
          parameter: element.parameter,
          chartType: element.chartType,
          parameterName: item.parameterName,
          parameterComm: item.communication,
          isConcat: item.isConcat,
          rows: item.rows,
          cols: item.cols,
          x: item.x,
          y: item.y,
        };

        this.onAddParameter(InsideParameter);
        arr.push(InsideParameter);
      });
    });

    console.log(this.parametersChartEntityMap);
    this.presetParameters = arr;
  }

  // public shouldShowChart(item: ChartGridsterItem): boolean {
  //   return item.units !== 'Value';
  // }
  public joinGroup(parameter: IcdParameter): void {
    const groupName = `${parameter.uavNumber}${parameter.communication}`;

    if (this.groupsJoined.includes(groupName)) return;

    this.liveTelemetryData.joinGroup(groupName).subscribe({
      next: () => {},
      error: (err) => console.error('Error joining group', err),
    });
  }
  private getRandomColor(): string {
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  public getUavs(): void {
    this.simulatorservice.getActiveUavs().subscribe(
      (res) => {
        console.log(res);
        this.uavsList = res;
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

  public calculateBlockWidth(item: any): string {
    const numberOfItems = item.chartEntitys.length;
    if (numberOfItems > 0) {
      return `${100 / numberOfItems}%`;
    }
    return '100%';
  }

  public concatGraphs(item: TelemetryGridsterItem): void {
    item.isConcatenated = !item.isConcatenated;
  }

  public archiveGraphs(item: TelemetryGridsterItem): void {
    item.isArchive = !item.isArchive;
  }

  showSuccess() {
    this.toastrService.success('Hello world!', 'Toastr fun!');
  }
  // public changeChartType(item: ChartGridsterItem, newType: ChartType): void {
  //   // item.chartType = newType;
  //   const blockComponent = this.gridsterBlocks.find(
  //     (block) => block.item === item
  //   );
  //   if (blockComponent) {
  //     // blockComponent.recreateChart();
  //   }
  // }

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
