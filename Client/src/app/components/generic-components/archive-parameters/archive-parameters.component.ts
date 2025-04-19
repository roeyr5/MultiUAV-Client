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
import { ArchiveData, ArchiveParameter, ArchiveRequestDto } from 'src/app/entities/models/archiveDto';
import { ArchiveService } from 'src/app/services/archive.service';
import { GenericTableComponent } from '../generic-table/generic-table.component';
import { ParameterDataDto } from 'src/app/entities/models/parameterDataDto';
import { Communication } from 'src/app/entities/enums/communication.enum';


@Component({
  selector: 'app-archive-parameters',
  templateUrl: './archive-parameters.component.html',
  styleUrls: ['./archive-parameters.component.css'],
  standalone: true,
  imports: [GenericTableComponent,CommonModule,MatFormFieldModule,NgxMatTimepickerModule,MatSelectModule,MatPaginatorModule,MatDatepickerModule,MatNativeDateModule,FormsModule,ReactiveFormsModule,MatSidenavModule]
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
    public uavsData : Map<string, ArchiveData[]> = new Map<string, ArchiveData[]>();
  
    public archiveDates = new FormGroup({
      start: new FormControl(),
      end: new FormControl(),
    });
  

  public get selectedTime(): string {
    return this._selectedTime;
  }

  public set selectedTime(value: string) {
    this._selectedTime = value;
  }
   
    public ngOnInit(): void {
      this.archiveDates.valueChanges.subscribe((value) => {
        console.log(value.start);
        console.log(value.end);
      });
    }

    toggleSidebar() {
      this.isClosed = !this.isClosed;
    }

    public getCurrentParameters(): void {
      this.filteredParameters = (this.parametersMap.get(this.selectedCOMM) || []).map(param => param.Identifier);
      console.log('Filtered Parameters:', this.filteredParameters);

    }

    public onRequestArchiveData() :void{

      const date = this.archiveDates.value.start; 
      const dateTimeString = date.toLocaleString();
      const fullDateTime = `${dateTimeString.split(' ')[0]} ${this.formattedTime}`;
  
      const archiveRequest: ArchiveRequestDto = {
        StartDate: new Date(fullDateTime),
        EndDate: this.archiveDates.value.end,
        UavNumbers: this.selectedUAVs,
        Communication: this.selectedCOMM,
        PageNumber: this.pageNumber,
        PageSize: this.pageSize,
      };
  
      console.log(archiveRequest);
      
      this.archiveService.getArchiveData(archiveRequest).subscribe((data) => {
        console.log(data);
        for (const item of data) {
          this.uavsData.set(item.uavNumber+item.communication, item.archiveDataPackets);
        }
        console.log(this.uavsData);
       }
      );
      
    }
   
    public isParameterSelected(parameterIdentifier: string): boolean {
      const uavMap = this.selectedParametersMap.get(this.selectedUAVs[0]);
      if (!uavMap) return false;
  
      const selectedParams = uavMap.get(this.selectedCOMM) || [];
      return selectedParams.some(param => param.Identifier === parameterIdentifier);
    }

    onChooseParameter(parameter:string):void{
  
      const allData: ArchiveParameter[] = [];
      for (let [uav, value] of this.uavsData) {
        const archiveParam = {uavName : uav, paramaeterName: parameter, dataArchive: [] } as ArchiveParameter;
  
        for (let entry of value) {
          if (parameter in entry.uavData) {
            console.log(parameter);
            archiveParam.dataArchive.push({
              dateTime: entry.dateTime,
              parameterValue : entry.uavData[parameter]
            });
          }
        }
        allData.push(archiveParam);
      }
      this.allArchivedParameters.set(this.selectedCOMM+"-"+parameter, allData);
      console.log(allData);
  
    }

    onPageChange(event: any): void {
      this.pageNumber = Math.max(event.pageIndex + 1, 1);
      console.log(this.pageNumber);
      
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
