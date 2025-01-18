import { Component , OnInit } from '@angular/core';
import { LtsService } from 'src/app/services/lts.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { UserService } from 'src/app/services/user.service';
import { DisplayGrid, GridsterConfig, GridsterItem,GridType }  from 'angular-gridster2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  
  protected options: GridsterConfig ={};
  protected dashboard: Array<GridsterItem> =[];

  protected uavsList:string[]=[];
  protected selectedUAV : string = '';
  protected sidebarOpen: boolean = false;
  protected selectedCommunication: string = '';

  protected selectedParameters: string[] = [];
  protected parametersarray: string[] = [];

  protected parametersMap: Map<string,string[]> = new Map<string,string[]>();
  protected selectedParametersMap: Map<string, string[]> = new Map<string, string[]>();
  protected items: Map<number,Map<string,string>> = new Map<number,Map<string,string>> ();

  constructor(private signalRService : SignalRService , private userservice:UserService , private ltsservice:LtsService){}

  public ngOnInit(): void {
      this.StartConnection();
      this.InitGridsterOptions();
      this.GetUAVS();
      this.getParameters();
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

      this.signalRService.receiveMessage().subscribe((message)=>{
        this.items.set(message.partition,message.message);
        console.log(message);
      });
    });
  }

  protected sendMessage(message: string): void {
    this.signalRService.sendMessage(message);
    console.log(message);

  }

  protected GetUAVS(){
    this.userservice.uavsNumberslist().subscribe((res)=>{
      console.log(res)
      this.uavsList =res;
    },(err) =>{
      console.error("error" , err);
    }
    )
  }

 protected getParameters(): void {
  this.userservice.getAllParameters().subscribe(
    (res) => {
      Object.entries(res).forEach(([key, value]) => {
        this.parametersMap.set(key, value); 
        this.selectedParametersMap.set(key, []); 
      });
      console.log('Parameters Map:', this.parametersMap);
    },
    (err) => {
      console.error('Error fetching parameters:', err);
    }
  );
}

  

  // protected onSelect(event: any): void {
  //   const selectedValue = event.value;

  //   this.dashboard.push({
  //     cols: 1, 
  //     rows: 1, 
  //     y: 0, 
  //     x: this.dashboard.length 
  //   });

  //   this.signalRService.addParameter(selectedValue); 
  // }

  public onSelectCommunication(event: any): void {
    this.selectedCommunication = event.value;
    console.log(`Selected Communication: ${this.selectedCommunication}`);
    this.updateParametersArray();
    this.selectedParameters = this.selectedParametersMap.get(this.selectedCommunication) || [];
  }
  
  protected getCurrentParameters(): string[] {
    const params = this.parametersMap.get(this.selectedCommunication) || [];
    console.log(`Current Parameters for ${this.selectedCommunication}:`, params);
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

  protected toggleParameterSelection(parameter: string): void {

    if (!this.selectedUAV) {
      Swal.fire({
        icon: 'info',
        title: 'No UAV Selected',
        text: 'Please select a UAV before adding parameters.',
      });
      return;
    }
    

    const selectedParams = this.selectedParametersMap.get(this.selectedCommunication) || [];
    const index = selectedParams.indexOf(parameter);

    if (index === -1) {
      selectedParams.push(parameter);
      this.dashboard.push({
        cols: 1,
        rows: 1,
        x: this.dashboard.length % 5, 
        y: Math.floor(this.dashboard.length / 5), 
        label: parameter, 
      });
    } else {
      selectedParams.splice(index, 1);
    }

    this.selectedParametersMap.set(this.selectedCommunication, selectedParams);
    console.log(
      `Selected Parameters for ${this.selectedCommunication}:`,
      selectedParams
    );
  }
  

   public onSelectUAV(event:any): void{
      console.log(event);
      this.selectedUAV = event;
      this.joinGroup();
    }
  protected onRemove(event: any): void {
    const selectedValue = event.value;
    this.signalRService.removeParameter(selectedValue);  
  }

  public joinGroup(): void {
      this.signalRService.joinGroup(this.selectedUAV).subscribe({
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
}
