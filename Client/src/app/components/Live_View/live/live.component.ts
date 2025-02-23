
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component , OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { SignalRService } from 'src/app/services/signalr.service';
import { UserService } from 'src/app/services/user.service';
import { DisplayGrid, GridsterComponent, GridsterConfig, GridsterItem,GridType }  from 'angular-gridster2';
import {ChartGridsterItem} from 'src/app/models/chartitem'
import Swal from 'sweetalert2';
import { ChartType } from 'angular-google-charts';
import { basicData } from 'src/app/models/dataitem';
import { ChartComponent } from '../chart/chart.component';
import { SimulatorService } from 'src/app/services/simulator.service';
import { UIChart } from 'primeng/chart';
import {
  ApexAxisChartSeries,ApexChart,ApexXAxis,ApexYAxis,ApexDataLabels,ApexTooltip,ApexStroke,ApexMarkers,ApexLegend, ApexTitleSubtitle
} from 'ng-apexcharts';


@Component({
  selector: 'app-main',
  templateUrl: './live.component.html',
  // changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit , AfterViewInit {
  
  @ViewChild(GridsterComponent) gridster!: GridsterComponent;
  @ViewChildren(ChartComponent) charts!: QueryList<ChartComponent>;
  // @ViewChildren(UIChart) charts!: QueryList<UIChart>;

  ChartType = ChartType; 

  graphOptions: any[] = [
    { label: 'line', image: 'assets/images/line_chart_icon.png' },
    { label: 'bar', image: 'assets/images/bar_chart_icon.png' },
    { label: 'pie', image: 'assets/images/pie_chart_icon.png' },
    { label: 'gauge', image: 'assets/images/gauge_chart_icon.png' },
  ];
  selectedGraph: any; 

  temp : string[] = [];
  protected options: GridsterConfig ={};
  protected dashboard: ChartGridsterItem[] = [];

  protected uavsList:string[]=[];
  protected selectedUAV : string = '';
  protected selectedCommunication: string = '';
  protected sidebarOpen: boolean = false;

  protected selectedParameters: string[] = [];
  protected parametersarray: string[] = [];

  protected parametersMap: Map<string,string[]> = new Map<string,string[]>();
  protected selectedParametersMap: Map<string, Map<string, string[]>> = new Map<string, Map<string, string[]>>();

  constructor(private simulatorservice: SimulatorService, private signalRService : SignalRService , private userservice:UserService , private cdr : ChangeDetectorRef){}

  public ngAfterViewInit() {
    if (this.gridster) {
      this.gridster.onResize();  
    }
  }

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

  private updateChartData(parameterMap: { [key: string]: string }, incomingFullUavName: string): void {
    this.dashboard.forEach((item, itemIndex) => {
      let datasetForThisUAV = item.datasets.find(ds => ds.uavName + item.communication === incomingFullUavName);
      if (!datasetForThisUAV) return;
  
      if (parameterMap[item.parameter] !== undefined) {
        const newValue = parseFloat(parameterMap[item.parameter]);
        if (isNaN(newValue)) {
          console.error('Received invalid value:', parameterMap[item.parameter]);
          return; // Skip updating if the value is invalid
        }
  
        const newLabel = new Date().toLocaleTimeString();
  
        if (['pie', 'gauge'].includes(item.chartType)) {
          datasetForThisUAV.data = [newValue];  // Pie and Gauge only use the latest value
          item.chartLabels = [newLabel];
        } else {
          if (datasetForThisUAV.data.length >= 10) datasetForThisUAV.data.shift();
          if (item.chartLabels.length >= 10) item.chartLabels.shift();
          datasetForThisUAV.data.push(newValue);
          item.chartLabels.push(newLabel);
        }
  
        const chart = this.charts.toArray()[itemIndex];
        if (chart) {
          chart.datasets = item.datasets.map(ds => ({
            label: ds.label,
            data: ds.data,
            color: ds.color
          }));
          chart.chartLabels = item.chartLabels;
          chart.chartTitle = item.parameter;
          chart.updateChart();
        }
      }
    });
  }
  
  
  
  
  protected GetUAVS(): void {
    this.simulatorservice.telemetryUavs().subscribe(
        (res) => {
            console.log("UAVs List:", res);
            this.uavsList = Object.keys(res);
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
    let foundItem = this.dashboard.find(item => item.communication === communication && item.parameter === parameter);
  
    if (!foundItem) {
      foundItem = {
        cols: 2,
        rows: 2,
        x: this.dashboard.length % 5,
        y: Math.floor(this.dashboard.length / 5),
        chartType: 'line',
        chartLabels: [],
        communication,
        parameter,
        datasets: [],
        showOptions: false
      };
      this.dashboard.push(foundItem);
    }
  
    const fullUavComm = `${uavName}${communication}`;
  
    const newDataset = {
      label: `${uavName} - ${parameter}`,
      data: [],
      color: this.getRandomColor(),
      uavName
    };
  
    foundItem.datasets.push(newDataset);
  
    this.signalRService.addParameter(fullUavComm, parameter);
    this.joinGroup();
  }
  

  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }  

  private removeParameterFromGridster(parameter: string, uavName: string, communication: string): void {
    const foundItem = this.dashboard.find(item => 
      item.communication === communication && 
      item.parameter === parameter
    );
  
    if (foundItem) {
      foundItem.datasets = foundItem.datasets.filter(ds => ds.uavName !== uavName);
  
      if (foundItem.datasets.length === 0) {
        this.dashboard = this.dashboard.filter(item => item !== foundItem);
        this.ChangedOptions(); 
      }
    }
  }
  
  
  private addParameterToGridster(parameter: string, uavName: string, communication: string): void {
    let foundItem = this.dashboard.find(item => item.communication === communication && item.parameter === parameter);
  
    if (!foundItem) {
      foundItem = {
        cols: 1,
        rows: 1,
        x: this.dashboard.length % 5,
        y: Math.floor(this.dashboard.length / 5),
        chartType: 'line',
        chartLabels: [],
        communication,
        parameter,
        datasets: [],
        showOptions : false
      };
      this.dashboard.push(foundItem);
    }
  
    const existingDataset = foundItem.datasets.find(ds => ds.uavName === uavName);
    if (!existingDataset) {
      const newDataset = {
        label: `${uavName} - ${parameter}`,
        data: [],
        color: this.getRandomColor(),
        uavName,
      };
      foundItem.datasets.push(newDataset);
    }
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
      this.addParameterToGridster(parameter, this.selectedUAV, this.selectedCommunication);
      this.joinGroup();
    } 
    else {
      selectedParams.splice(paramIndex, 1);
      this.removeParameterFromGridster(parameter, this.selectedUAV, this.selectedCommunication);
    }
  
    uavMap.set(this.selectedCommunication, selectedParams);
    this.selectedParametersMap.set(this.selectedUAV, uavMap);
    console.log(`Selected Parameters for UAV: ${this.selectedUAV}, Communication: ${this.selectedCommunication}:`, selectedParams);

    this.toggleUAVParameterSelection(this.selectedUAV, this.selectedCommunication, parameter);
}
  
  protected getChartData(item: ChartGridsterItem) {
    const chartData = {
      labels: item.chartLabels, 
      datasets: item.datasets.map((ds) => ({
        label: ds.label,
        data: ds.data, 
        borderColor: ds.color,
        fill: false,
      })),
    };
    return chartData;
  }

  public joinGroup(): void {
    const groupName = `${this.selectedUAV}${this.selectedCommunication}`;

    this.signalRService.joinGroup(groupName).subscribe({
      next: () => console.log(`Joined group: ${groupName}`),
      error: (err) => console.error('Error joining group', err),
    });
  }

  public leaveGroup(): void {
    const groupName = `${this.selectedUAV}${this.selectedCommunication}`; 
    
    this.signalRService.leaveGroup(groupName).subscribe({
      next: () => console.log(`Left group: ${groupName}`),
      error: (err) => console.error('Error leaving group', err),
    });
  }

  // getChartOptions(item: ChartGridsterItem): any {
  //   return {
  //     hAxis: { title: 'Time' },
  //     vAxis: { title: 'Value' },
  //     legend: { position: 'bottom' },
  //     colors: item.datasets.map(ds => ds.color)
  //   };
  // }


  public changeChartType(item: ChartGridsterItem, newType: any): void {
    item.chartType = newType.label; 
    console.log(newType.label)
    const chart = this.charts.toArray()[this.dashboard.indexOf(item)];
    if (chart) {
      chart.updateChartType(newType.label);  
    } else {
      console.warn('Chart instance not found for item:', item);
    }
  }

   
} 