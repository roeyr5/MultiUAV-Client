import { ChangeDetectorRef, Component , OnInit, QueryList, ViewChildren } from '@angular/core';
import { LtsService } from 'src/app/services/lts.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { UserService } from 'src/app/services/user.service';
import { DisplayGrid, GridsterConfig, GridsterItem,GridType }  from 'angular-gridster2';
import {ChartGridsterItem} from 'src/app/models/chartitem'
import Swal from 'sweetalert2';
import { ChartType } from 'chart.js';
import { basicData } from 'src/app/models/dataitem';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  
  @ViewChildren(UIChart) charts!: QueryList<UIChart>;

  protected options: GridsterConfig ={};
  protected dashboard: Array<ChartGridsterItem> =[];

  protected uavsList:string[]=[];
  protected selectedUAV : string = '';
  protected selectedCommunication: string = '';
  protected sidebarOpen: boolean = false;

  protected selectedParameters: string[] = [];
  protected parametersarray: string[] = [];

  protected parametersMap: Map<string,string[]> = new Map<string,string[]>();
  protected selectedParametersMap: Map<string, Map<string, string[]>> = new Map<string, Map<string, string[]>>();

  constructor(private signalRService : SignalRService , private userservice:UserService , private ltsservice:LtsService , private cdr : ChangeDetectorRef){}

  public ngOnInit(): void {
      this.StartConnection();
      this.InitGridsterOptions();
      this.GetUAVS();
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

  public toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
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
  
  private StartConnection(){
    this.signalRService.startConnection().subscribe((response)=>{
      console.log("worked signalR");

      this.signalRService.receiveMessage().subscribe((message) => {
        console.log("Received message:", message);
        
        const parameterMap = message.message; 
        const uavName = message.uavName;
        this.updateChartData(parameterMap,uavName);
    });
  });
  }

  protected sendMessage(message: string): void {
    this.signalRService.sendMessage(message);
    console.log(message);

  }

  private updateChartData( parameterMap: { [key: string]: string }, incomingUavName: string ): void {

    this.dashboard.forEach((item, itemIndex) => {
      const datasetForThisUAV = item.datasets.find(
        (ds) => ds.uavName === incomingUavName
      );
      
      if (!datasetForThisUAV) return; 
  
      if (parameterMap[item.parameter] !== undefined) {
        
        const newValue = parseFloat(parameterMap[item.parameter]);
        datasetForThisUAV.data.push(newValue);
        const newLabel = new Date().toLocaleTimeString();
        item.chartLabels.push(newLabel);
        
        if (datasetForThisUAV.data.length > 10) {
          datasetForThisUAV.data.shift();
        }
        if (item.chartLabels.length > 10) {
          item.chartLabels.shift();
        }
        const chart = this.charts.toArray()[itemIndex];
        if (chart) {
          chart.refresh();
        }
      }
    });
  
    this.cdr.detectChanges();
  }
  
  
  protected GetUAVS(): void {
    this.userservice.uavsNumberslist().subscribe(
        (res) => {
            console.log("UAVs List:", res);
            this.uavsList = res;
            this.getParameters(); 
        },
        (err) => {
            console.error("Error fetching UAVs list:", err);
        }
    );
}


 protected getParameters(): void {
  this.userservice.getAllParameters().subscribe(
    (res) => {
      Object.entries(res).forEach(([communication, parameters]) => {
        this.parametersMap.set(communication, parameters); 
        this.uavsList.forEach(uav => {
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

public onSelectUAV(event:any): void{

  this.selectedUAV = event.value;
  this.updateParametersArray();
  if (this.selectedCommunication) {
    const uavMap = this.selectedParametersMap.get(this.selectedUAV);
    this.selectedParameters = uavMap?.get(this.selectedCommunication) || [];
  }
  }

public onSelectCommunication(event: any): void {
  this.selectedCommunication = event.value;
  this.updateParametersArray();
  if (this.selectedUAV) {
      const uavMap = this.selectedParametersMap.get(this.selectedUAV);
      this.selectedParameters = uavMap?.get(this.selectedCommunication) || [];
    }
  }


  
  protected getCurrentParameters(): string[] {
    const params = this.parametersMap.get(this.selectedCommunication) || [];
    return params;
  }
  
  
  private updateParametersArray() {
    if (this.selectedCommunication) {
      const type = this.selectedCommunication as 'FBDown' | 'FBUp' | 'MissionDown' | 'MissionUp';
      this.parametersarray = this.parametersMap.get(type) || [];
    }
  }
  protected isParameterSelected(parameter: string): boolean {
    return this.selectedParameters.includes(parameter);
  }

  protected toggleUAVParameterSelection(uavName: string, communication: string, parameter: string): void {

    let chartItem = this.dashboard.find(
      (item) => item.communication === communication && item.parameter === parameter
    );
  
    if (!chartItem) {
      chartItem = {
        cols: 1,
        rows: 1,
        x: this.dashboard.length % 5,
        y: Math.floor(this.dashboard.length / 5),
  
        chartType: 'line',
        chartLabels: [],
        communication,
        parameter,
        datasets: [],
      };
      this.dashboard.push(chartItem);
    }

    const existingDatasetIndex = chartItem.datasets.findIndex(ds => ds.uavName === uavName);
  
    if (existingDatasetIndex === -1) {
      chartItem.datasets.push({
        uavName: uavName,
        data: [],
        label: uavName,
        color: this.getRandomColor()
      });
      const fullUavComm = `${uavName}${communication}`;
      this.signalRService.addParameter(fullUavComm, parameter);
  
    } else {
      chartItem.datasets.splice(existingDatasetIndex, 1);
      const fullUavComm = `${uavName}${communication}`;
      this.signalRService.removeParameter(fullUavComm, parameter);
    }
  }
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }  
  
  protected toggleParameterSelection(parameter: string): void {
    if (!this.selectedUAV || !this.selectedCommunication) {
        Swal.fire({
            icon: 'info',
            title: 'Missing Selection',
            text: 'Please select both a UAV and a communication type before adding parameters.',
        });
        return;
    }

    let uavMap = this.selectedParametersMap.get(this.selectedUAV);
    if (!uavMap) {
        uavMap = new Map<string, string[]>();
        this.selectedParametersMap.set(this.selectedUAV, uavMap);
    }

    let selectedParams = uavMap.get(this.selectedCommunication);
    if (!selectedParams) {
        selectedParams = [];
        uavMap.set(this.selectedCommunication, selectedParams);
    }

    const paramIndex = selectedParams.indexOf(parameter);
    if (paramIndex === -1) {
        selectedParams.push(parameter);
    } else {
        selectedParams.splice(paramIndex, 1);
    }

    uavMap.set(this.selectedCommunication, selectedParams);
    this.selectedParametersMap.set(this.selectedUAV, uavMap);
    console.log(`Selected Parameters for UAV: ${this.selectedUAV}, Communication: ${this.selectedCommunication}:`, selectedParams);

    this.toggleUAVParameterSelection(this.selectedUAV, this.selectedCommunication, parameter);
}
  
  protected getChartData(item: ChartGridsterItem) {
    return {
      labels: item.chartLabels,
      datasets: item.datasets.map((ds, index) => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.color,
        fill: false
      }))
    };
  }


  public joinGroup(): void {
      this.signalRService.joinGroup(this.selectedUAV+this.selectedCommunication).subscribe({
        next: () => console.log(`Joined group: ${this.selectedUAV}`),
        error: (err) => console.error('Error joining group', err),
      });
  }

  public leaveGroup(): void {
    if (this.selectedUAV) {
      this.signalRService.leaveGroup(this.selectedUAV).subscribe({
        next: () => console.log(`Left group: ${this.selectedUAV}`),
        error: (err) => console.error('Error leaving group', err),
      });
    } else {
      console.warn('No UAV selected to leave a group');
    } 
  }

  protected changeChartType(item: ChartGridsterItem, chartType: ChartType): void {
  
      item.chartType = chartType; 
      const chart = this.charts.toArray()[this.dashboard.indexOf(item)];
      if (chart) {
        chart.chart.config.type = chartType; 
        chart.refresh(); 
      }
      else {
      Swal.fire({
        icon: 'error',
        title: 'Unsupported Chart Type',
        text: `${chartType} is not supported for this data.`,
      });
    }
  }
}