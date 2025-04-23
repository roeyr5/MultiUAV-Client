import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { ArchiveParameterData, ArchiveParameter, ArchiveManyRequestDto,ArchiveSingleRequestDto } from 'src/app/entities/models/archiveDto';
import { ArchiveService } from 'src/app/services/archive.service';
import { GenericTableComponent } from '../generic-table/generic-table.component';
import { ParameterDataDto } from 'src/app/entities/models/parameterDataDto';
import { Communication } from 'src/app/entities/enums/communication.enum';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-archive-parameters',
  templateUrl: './archive-parameters.component.html',
  styleUrls: ['./archive-parameters.component.css'],
  standalone: true,
  imports: [GenericTableComponent,MatInputModule,MatIconModule,MatDialogModule,MatButtonModule,CommonModule,MatFormFieldModule,NgxMatTimepickerModule,MatSelectModule,MatPaginatorModule,MatDatepickerModule,MatNativeDateModule,FormsModule,ReactiveFormsModule,MatSidenavModule,NgxMaterialTimepickerModule]
})
export class ArchiveParametersComponent implements OnInit {

  constructor(private archiveService: ArchiveService) {}
  
    public allArchivedParameters: Map<string,ArchiveParameter[]> = new Map<string,ArchiveParameter[]>();
  
    public filteredParameters: string[] = [];

    protected parametersarray: ParameterDataDto[] = [];

    public isClosed = false;
    public hours: number = 12;
    public minutes: number = 0;
    public formattedTime: string = '12:00';
    private _selectedTime: string = '';

    public pageSize:number = 10;
    public pageNumber:number = 1;
    
    @Input() public uavsNumbers: number[] = [];
    @Input() public parametersMap: Map<string, ParameterDataDto[]> = new Map<string,ParameterDataDto[]>();
    @Input() public selectedParametersMap: Map<number, Map<string, ParameterDataDto[]>> = new Map<number, Map<string, ParameterDataDto[]>>();

    public selectedUAVs: number[] = [];
    public selectedCOMM: string = '';
    public uavsData : Map<string, ArchiveParameterData[]> = new Map<string, ArchiveParameterData[]>();
  
    public archiveDates = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
  

    public ngOnInit(): void {
      this.archiveDates.valueChanges.subscribe((value) => {
        console.log(value.start);
        console.log(value.end);
      });
    }

  public get selectedTime(): string {
    return this._selectedTime;
  }

  public set selectedTime(value: string) {
    this._selectedTime = value;
  }
   

  public toggleSidebar() {
      this.isClosed = !this.isClosed;
    }

  public getCurrentParameters(): void {
      this.filteredParameters = (this.parametersMap.get(this.selectedCOMM) || []).map(param => param.Identifier);
      console.log('Filtered Parameters:', this.filteredParameters);

    }

    //   this.archiveService.getArchiveData(archiveRequest).subscribe((data) => {
    //     console.log(data);
    //     for (const item of data) {
    //       this.uavsData.set(item.uavNumber+item.communication, item.archiveDataPackets);
    //     }
    //     console.log(this.uavsData);
    //    }
    //   );
      
    // }
   
  public isParameterSelected(parameterIdentifier: string): boolean {
      const uavMap = this.selectedParametersMap.get(this.selectedUAVs[0]);
      if (!uavMap) return false;
  
      const selectedParams = uavMap.get(this.selectedCOMM) || [];
      
      return selectedParams.some(param => param.Identifier === parameterIdentifier);

    }

  public onChooseParameter(parameter: string): void {
     
    const date = this.archiveDates.value.start;
    const dateTimeString = date.toLocaleString();
    const fullDateTime = `${dateTimeString.split(' ')[0]} ${this.formattedTime}`;
    const startDate = new Date(fullDateTime);
    const israelTimeOffset = 3; 
    const israelStartDate = new Date(startDate.getTime() + israelTimeOffset * 60 * 60 * 1000);
    const israelEndDate = new Date(this.archiveDates.value.end.getTime() + israelTimeOffset * 60 * 60 * 1000);
    // Create the archive request
    const archiveRequest: ArchiveSingleRequestDto = {
        StartDate: israelStartDate,
        EndDate: israelEndDate,
        UavNumbers: this.selectedUAVs,
        Communication: this.selectedCOMM,
        PageNumber: this.pageNumber,
        PageSize: this.pageSize,
        ParameterName: parameter
    };

  
      const parameterName = this.parametersarray.find(p => p.Identifier === parameter);
      if (!parameterName) return;
      console.log(parameterName);
      
      let uavMap = this.selectedParametersMap.get(this.selectedUAVs[0]);
      console.log(uavMap);
      
      if (!uavMap) {
        uavMap = new Map<string, ParameterDataDto[]>();
        this.selectedParametersMap.set(this.selectedUAVs[0], uavMap);
        console.log(uavMap);
        
      }
  
      let selectedParams = uavMap.get(this.selectedCOMM);
      if (!selectedParams) {
        selectedParams = [];
        uavMap.set(this.selectedCOMM, selectedParams);
        console.log(uavMap);
        
      }
    
      const paramIndex = selectedParams.findIndex(p=> p.Identifier === parameter);
      if (paramIndex === -1) {
        selectedParams.push(parameterName);
        this.archiveService.getArchiveData(archiveRequest).subscribe((res) => {
            const allData: ArchiveParameter[] = [];
    
            for (const item of res) {
                const archiveParam: ArchiveParameter = {
                  uavName: item.uavNumber.toString(),
                  communication: item.communication,
                  paramaeterName: parameter,
                  dataArchive: []
                };
                for (const entry of item.archiveDataPackets) {
                  archiveParam.dataArchive.push({
                      uavNumber: item.uavNumber,
                      dateTime: entry.dateTime,
                      value: entry.value,
                    });
                }
                allData.push(archiveParam);
            }
            
            this.allArchivedParameters.set(this.selectedCOMM + "-" + parameter, allData);
            console.log(this.allArchivedParameters);
            
            for (const item of res) {
              this.uavsData.set(item.uavNumber+item.communication, item.archiveDataPackets);
            }
        });
      } else {
        selectedParams.splice(paramIndex, 1);
      }

      uavMap.set(this.selectedCOMM, selectedParams);
      this.selectedParametersMap.set(this.selectedUAVs[0], uavMap);

  }
  

 

  public onPageChange(event: any): void {
    this.pageNumber = Math.max(event.pageIndex + 1, 1);
    this.pageSize = event.pageSize;
    // this.reloadDataForAllParameters();
    this.groupDataForBackend();
  }

  private groupDataForBackend(): void {
    const uavs: string[] = [];
    const parameters: string[] = [];
    const communications: string[] = [];

    // Iterate over the `Map` (this.allArchivedParameters)
    for (const [paramName, parameterArray] of this.allArchivedParameters) {
        for (const paramData of parameterArray) {
            const uavName = paramData.uavName;
            const communication = paramData.communication;
            
            // Add the UAV to the UAVs array if it's not already present
            if (!uavs.includes(uavName)) {
                uavs.push(uavName);
            }

            // Extract the parameter name (you might want to split it if needed)
            const parts = paramName.split('-');
            const parameter = parts.slice(1).join('-');
            if (!parameters.includes(parameter)) {
                parameters.push(parameter);
            }

            if (!communications.includes(communication)) {
                communications.push(communication);
            }
        }
    }
    this.reloadDataPagination(uavs, parameters, communications);

  }

  private reloadDataPagination(uavs: string[], parameters: string[], communications: string[]): void {
    communications.forEach(comm => {
        const archiveRequest: ArchiveManyRequestDto = {
            StartDate: this.archiveDates.value.start,
            EndDate: this.archiveDates.value.end,
            UavNumbers: uavs.map(Number),
            Communication: comm,
            PageNumber: this.pageNumber,
            PageSize: this.pageSize,
            ParameterNames: parameters
        };

        this.archiveService.getMultiArchiveData(archiveRequest).subscribe({
            next: (response) => this.processMultiArchiveResponse(response, comm),
            error: (err) => console.error('Error loading data:', err)
        });
    });
}
  private processMultiArchiveResponse(response :any , comm:any) :void{
    console.log(response);
    console.log(comm);
    
  }

  private reloadDataForAllParameters(): void {
    this.allArchivedParameters.forEach((_, key) => {
      const parts = key.split('-');
      if (parts.length < 2) return;
      const parameter = parts.slice(1).join('-');
      this.onChooseParameter(parameter);
    });
  }

  public updateAllParameters():void{
        
    this.allArchivedParameters.clear();
    this.uavsData.clear();
   
  }
  
  public onTimeChange():void {
      if (this.selectedTime) {
        const [hours, minutes] = this.selectedTime.split(':');
        this.hours = parseInt(hours, 10);
        this.minutes = parseInt(minutes, 10);
        this.updateFormattedTime();
      }
  }
  
    private updateFormattedTime() {
      this.formattedTime = `${this.hours.toString().padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}`;
      console.log(this.formattedTime);
      
    }
  
    public onSelectUAV(event: any): void {
      
      this.selectedUAVs=event.value;
      this.updateParametersArray();
      console.log(this.selectedUAVs);
    }
  
    private updateParametersArray() {
        if (this.selectedCOMM) {
          const type = this.selectedCOMM as Communication;
          this.parametersarray = this.parametersMap.get(type) || [];
        }
      }

    public onSelectCommunication(event:any):void{
      console.log('Selected Communication:', event.value); // Check if selected value is being passed
      this.selectedCOMM = event.value;
      this.updateParametersArray();
      this.getCurrentParameters();
    }

}
