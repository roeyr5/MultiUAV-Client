import { Component, OnInit } from '@angular/core';
import { SimulatorService } from 'src/app/services/simulator.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side-bar-parameters',
  templateUrl: './side-bar-parameters.component.html',
  styleUrls: ['./side-bar-parameters.component.css']
})

export class SideBarParametersComponent implements OnInit {

  protected uavsList:string[]=[];
  protected selectedUAV : string = '';
  protected selectedCommunication: string = '';
  
  protected parametersMap: Map<string,string[]> = new Map<string,string[]>();
  protected selectedParametersMap: Map<string, Map<string, string[]>> = new Map<string, Map<string, string[]>>();
  
  protected selectedParameters: string[] = [];
  protected parametersarray: string[] = [];

  constructor(private simulatorservice:SimulatorService , private userservice:UserService){}

  ngOnInit(): void {
      this.GetUAVS();
  }

  public GetUAVS(): void {
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

 public getParameters(): void {
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


  public getCurrentParameters(): string[] {
    const params = this.parametersMap.get(this.selectedCommunication) || [];
    return params;
  }

  private updateParametersArray() {
    if (this.selectedCommunication) {
      const type = this.selectedCommunication as 'FBDown' | 'FBUp' | 'MissionDown' | 'MissionUp';
      this.parametersarray = this.parametersMap.get(type) || [];
    }
  }
  public isParameterSelected(parameter: string): boolean {
    const uavMap = this.selectedParametersMap.get(this.selectedUAV);
    if (!uavMap) return false;
  
    const selectedParams = uavMap.get(this.selectedCommunication) || [];
    return selectedParams.includes(parameter);
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
        // this.addParameterToGridster(parameter, this.selectedUAV, this.selectedCommunication);
        // this.joinGroup();
        selectedParams.push(parameter);
      } 
      else {
        // this.removeParameterFromGridster(parameter, this.selectedUAV, this.selectedCommunication);
        selectedParams.splice(paramIndex, 1);
      }
    
      uavMap.set(this.selectedCommunication, selectedParams);
      this.selectedParametersMap.set(this.selectedUAV, uavMap);
      console.log(`Selected Parameters for UAV: ${this.selectedUAV}, Communication: ${this.selectedCommunication}:`, selectedParams);
  
      // this.toggleUAVParameterSelection(this.selectedUAV, this.selectedCommunication, parameter);
  }
}
