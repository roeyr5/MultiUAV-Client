import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SimulatorService } from 'src/app/services/simulator.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { IcdParameter } from 'src/app/entities/IcdParameter';
import { Communication } from 'src/app/entities/enums/communication.enum';
import { ParameterDataDto } from 'src/app/entities/models/parameterDataDto';
import { SingleChart } from 'src/app/entities/enums/chartType.enum';
import { InsideParameterDTO } from 'src/app/entities/models/addParameter';

@Component({
  selector: 'app-side-bar-parameters',
  templateUrl: './side-bar-parameters.component.html',
  styleUrls: ['./side-bar-parameters.component.css'],
})
export class SideBarParametersComponent implements OnInit {
  @Input() public uavsList: number[] = [];
  @Input() public parametersMap: Map<string, ParameterDataDto[]> = new Map<string,ParameterDataDto[]>();
  @Input() public selectedParametersMap: Map<number, Map<string, ParameterDataDto[]>> = new Map<number, Map<string, ParameterDataDto[]>>();
  @Input() public presetParameters:InsideParameterDTO[] = []    

  @Output() public onCloseSideBar: EventEmitter<void> = new EventEmitter<void>();
  @Output() onAddParameter: EventEmitter<InsideParameterDTO> = new EventEmitter<InsideParameterDTO>();
  @Output() onRemoveParameter: EventEmitter<IcdParameter> = new EventEmitter<IcdParameter>();

  public selectedUAV: number = 0;
  protected selectedCommunication: string = '';

  // protected selectedParameters: ParameterDataDto[] = [];
  protected parametersarray: ParameterDataDto[] = [];

  public filteredParameters: string[] = [];

  constructor(
    private simulatorservice: SimulatorService,
    private userservice: UserService
  ) {}

  public ngOnInit(): void {
    console.log("tomer",this.presetParameters);
    this.addPresetParameters();
  }

  
  public closeSideBar(): void {
    
    this.onCloseSideBar.emit();
  }

  public onSelectUAV(event: any): void {
    this.selectedUAV = event.value;
    this.updateParametersArray();
    // if (this.selectedCommunication) {
      // const uavMap = this.selectedParametersMap.get(this.selectedUAV);
      // this.selectedParameters = uavMap?.get(this.selectedCommunication) || [];
    // }
  }

  public onSelectCommunication(event: any): void {
    this.selectedCommunication = event.value;
    this.updateParametersArray();
    if (this.selectedUAV) {
      // const uavMap = this.selectedParametersMap.get(this.selectedUAV);
      // this.selectedParameters = uavMap?.get(this.selectedCommunication) || [];
      this.getCurrentParameters();
    }
  }

  public getCurrentParameters(): void {
    this.filteredParameters = (this.parametersMap.get(this.selectedCommunication) || []).map(param => param.Identifier);
  }

  private updateParametersArray() {
    if (this.selectedCommunication) {
      const type = this.selectedCommunication as Communication;
      this.parametersarray = this.parametersMap.get(type) || [];
    }
  }

  public isParameterSelected(parameterIdentifier: string): boolean {
    const uavMap = this.selectedParametersMap.get(this.selectedUAV);
    if (!uavMap) return false;

    const selectedParams = uavMap.get(this.selectedCommunication) || [];
    return selectedParams.some(param => param.Identifier === parameterIdentifier);
  }

  protected toggleParameterSelection(parameterName: string): void {
    if (!this.selectedUAV || !this.selectedCommunication) {
      Swal.fire({
        icon: 'info',
        title: 'Missing Selection',
        text: 'Please select both a UAV and a communication type before adding parameters.',
      });
      return;
    }

    const parameter = this.parametersarray.find(p => p.Identifier === parameterName);
    if (!parameter) return;

    let uavMap = this.selectedParametersMap.get(this.selectedUAV);
    if (!uavMap) {
      uavMap = new Map<string, ParameterDataDto[]>();
      this.selectedParametersMap.set(this.selectedUAV, uavMap);
    }

    let selectedParams = uavMap.get(this.selectedCommunication);
    if (!selectedParams) {
      selectedParams = [];
      uavMap.set(this.selectedCommunication, selectedParams);
    }

    const paramIndex = selectedParams.findIndex(p=> p.Identifier === parameterName);


    const paramterICD = new IcdParameter(parameterName,this.selectedCommunication, this.selectedUAV,
      parameter.Units,parameter.InterfaceLimitMin,parameter.InterfaceLimitMax);
    const chartType: SingleChart = paramterICD.units === 'Value' ? SingleChart.LABEL : SingleChart.GAUGE;

    if (paramIndex === -1) {
      selectedParams.push(parameter);
      let emitParameter : InsideParameterDTO = {
        parameter: paramterICD,
        chartType: chartType,
        parameterName: parameterName,
        parameterComm: this.selectedCommunication,
        isConcat: false,
        rows:1,
        cols: 1,
        x:1,
        y:1,
      }
      this.onAddParameter.emit(emitParameter);
    } else {
      
      selectedParams.splice(paramIndex, 1);
      this.onRemoveParameter.emit(paramterICD);
    }

    uavMap.set(this.selectedCommunication, selectedParams);
    this.selectedParametersMap.set(this.selectedUAV, uavMap);
    // console.log(
    //   `Selected Parameters for UAV: ${this.selectedUAV}, Communication: ${this.selectedCommunication}:`,
    //   selectedParams
    // );

    // this.toggleUAVParameterSelection(this.selectedUAV, this.selectedCommunication, parameter);
  }

  public addPresetParameters():void{
    
    for (const element of this.presetParameters) {
  
      let uavMap = this.selectedParametersMap.get(element.parameter.uavNumber);
      if (!uavMap) {
        uavMap = new Map<string, ParameterDataDto[]>();
        this.selectedParametersMap.set(element.parameter.uavNumber, uavMap);
      }
  
      let selectedParams = uavMap.get(element.parameter.communication);
      if (!selectedParams) {
        selectedParams = [];
        uavMap.set(element.parameter.communication, selectedParams);
      }
  
      const paramIndex = selectedParams.findIndex(p=> p.Identifier === element.parameter.parameterName);
  
      if (paramIndex === -1) {
        selectedParams.push(new ParameterDataDto(element.parameter.parameterName,element.parameter.units,element.parameter.InterfaceLimitMin,element.parameter.InterfaceLimitMax));
  
        uavMap.set(element.parameter.communication, selectedParams);
        this.selectedParametersMap.set(element.parameter.uavNumber, uavMap);
      }
    }
  }
  // private addParameterToGridster(parameter: string, uavName: string, communication: string): void {
  //   let foundItem = this.dashboard.find(item => item.communication === communication && item.parameter === parameter);

  //   if (!foundItem) {
  //     foundItem = {
  //       cols: 1,
  //       rows: 1,
  //       x: this.dashboard.length % 5,
  //       y: Math.floor(this.dashboard.length / 5),
  //       chartType: 'line',
  //       chartLabels: [],
  //       communication,
  //       parameter,
  //       datasets: [],
  //       showOptions : false
  //     };
  //     this.dashboard.push(foundItem);
  //   }

  //   const existingDataset = foundItem.datasets.find(ds => ds.uavName === uavName);
  //   if (!existingDataset) {
  //     const newDataset = {
  //       label: `${uavName} - ${parameter}`,
  //       data: [],
  //       color: this.getRandomColor(),
  //       uavName,
  //     };
  //     foundItem.datasets.push(newDataset);
  //   }

  //   this.signalRService.addParameter(uavName+communication, parameter);
  //   this.joinGroup();
  // }
}
