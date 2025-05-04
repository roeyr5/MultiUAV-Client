import { Component , OnInit} from '@angular/core';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatNativeDateModule} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ArchiveService } from 'src/app/services/archive.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
// Removed invalid MatTimepickerModule import
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ArchiveSingleRequestDto } from 'src/app/entities/models/archiveDto';
import { GenericTableComponent } from '../../generic-components/generic-table/generic-table.component'; 
import { IcdParameter } from 'src/app/entities/IcdParameter';
import { ArchiveParameter } from 'src/app/entities/models/archiveDto';
import { ArchiveParametersComponent } from '../../generic-components/archive-parameters/archive-parameters.component';
import { SimulatorService } from 'src/app/services/simulator.service';
import { UserService } from 'src/app/services/user.service';
import { ParameterDataDto } from 'src/app/entities/models/parameterDataDto';

@Component({
  selector: 'app-archive-data',
  templateUrl: './archive-data.component.html',
  styleUrls: ['./archive-data.component.css'],
  standalone: true,
  imports: [ArchiveParametersComponent,CommonModule,MatFormFieldModule,NgxMatTimepickerModule,MatSelectModule,MatPaginatorModule,MatDatepickerModule,MatNativeDateModule,FormsModule,ReactiveFormsModule,MatSidenavModule],
  // Removed MatTimepickerModule from imports
})
export class ArchiveDataComponent implements OnInit {

   constructor(
      private simulatorservice: SimulatorService,
      private userservice: UserService,
      private archiveService: ArchiveService
    ){}

    protected uavsNumbers: number[] = [];
    protected parametersMap: Map<string, ParameterDataDto[]> = new Map<string,ParameterDataDto[]>();
    protected selectedParametersMap: Map<number,Map<string, ParameterDataDto[]>> = new Map<number, Map<string, ParameterDataDto[]>>();

    public ngOnInit(): void {
      this.getAllUavsNumbers();
      this.getParameters();
    }
    
   protected getParameters(): void {
      this.userservice.getAllParameters().subscribe(
        (res) => {
          Object.entries(res).forEach(([communication, parameters]) => {
            this.parametersMap.set(communication, parameters);
            this.uavsNumbers.forEach((uav) => {
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

    public getAllUavsNumbers() :void{
  
      this.archiveService.getArchiveUavs().subscribe((data) => { 
        for (const uavNumber of data) {
         this.uavsNumbers.push(uavNumber)
        }
      });
      console.log(this.uavsNumbers);
    }
}