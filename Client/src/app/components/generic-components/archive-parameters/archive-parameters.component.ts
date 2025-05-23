import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import {
  ArchiveParameterData,
  ArchiveParameter,
  ArchiveManyRequestDto,
  ArchiveSingleRequestDto,
} from 'src/app/entities/models/archiveDto';
import { ArchiveService } from 'src/app/services/archive.service';
import { GenericTableComponent } from '../generic-table/generic-table.component';
import { ParameterDataDto } from 'src/app/entities/models/parameterDataDto';
import { Communication } from 'src/app/entities/enums/communication.enum';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-archive-parameters',
  templateUrl: './archive-parameters.component.html',
  styleUrls: ['./archive-parameters.component.css'],
  standalone: true,
  imports: [
    GenericTableComponent,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    MatFormFieldModule,
    NgxMatTimepickerModule,
    MatSelectModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    NgxMaterialTimepickerModule,
  ],
})
export class ArchiveParametersComponent implements OnInit {
  constructor(
    private archiveService: ArchiveService,
    private toastService: ToastrService
  ) {}

  @ViewChild('paginator', { static: true }) paginator!: MatPaginator;

  public allArchivedParameters: Map<string, ArchiveParameter[]> = new Map<
    string,
    ArchiveParameter[]
  >();

  public dataEvent = new Subject<{ param: string; data: ArchiveParameter[] }>();

  processedData: any = {};
  public filteredParameters: string[] = [];

  protected parametersarray: ParameterDataDto[] = [];

  public isClosed = false;
  public hours: number = 12;
  public minutes: number = 0;
  public formattedTime: string = '12:00';
  private _selectedTime: string = '';

  public pageSize: number = 10;
  public pageNumber: number = 1;

  @Input() public uavsNumbers: number[] = [];
  @Input() public parametersMap: Map<string, ParameterDataDto[]> = new Map<
    string,
    ParameterDataDto[]
  >();
  @Input() public selectedParametersMap: Map<
    number,
    Map<string, ParameterDataDto[]>
  > = new Map<number, Map<string, ParameterDataDto[]>>();

  public selectedUAVs: number[] = [];
  public selectedCOMM: string = '';
  public uavsData: Map<string, ArchiveParameterData[]> = new Map<
    string,
    ArchiveParameterData[]
  >();

  public archiveDates = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  public ngOnInit(): void {
    this.archiveDates.valueChanges.subscribe((value) => {});
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
    this.filteredParameters = (
      this.parametersMap.get(this.selectedCOMM) || []
    ).map((param) => param.Identifier);
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

    return selectedParams.some(
      (param) => param.Identifier === parameterIdentifier
    );
  }

  public onChooseParameter(parameter: string): void {
    const rawStart = this.archiveDates.value.start as Date;
    const rawEnd = this.archiveDates.value.end as Date;

    if (!rawStart || !rawEnd) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please pick start dates',
      });
      return;
    }

    const start = new Date(rawStart);
    const end = new Date(rawEnd);

    start.setHours(this.hours, this.minutes, 0, 0);
    end.setHours(this.hours, this.minutes, 0, 0);

    const archiveRequest: ArchiveSingleRequestDto = {
      StartDate: start,
      EndDate: end,
      UavNumbers: this.selectedUAVs,
      Communication: this.selectedCOMM,
      PageNumber: this.pageNumber,
      PageSize: this.pageSize,
      ParameterName: parameter,
    };

    const parameterName = this.parametersarray.find(
      (p) => p.Identifier === parameter
    );
    if (!parameterName) return;

    let uavMap = this.selectedParametersMap.get(this.selectedUAVs[0]);

    if (!uavMap) {
      uavMap = new Map<string, ParameterDataDto[]>();
      this.selectedParametersMap.set(this.selectedUAVs[0], uavMap);
    }

    let selectedParams = uavMap.get(this.selectedCOMM);
    if (!selectedParams) {
      selectedParams = [];
      uavMap.set(this.selectedCOMM, selectedParams);
    }

    const paramIndex = selectedParams.findIndex(
      (p) => p.Identifier === parameter
    );
    if (paramIndex === -1) {
      selectedParams.push(parameterName);
      this.archiveService.getArchiveData(archiveRequest).subscribe((res) => {
        const allData: ArchiveParameter[] = [];

        for (const item of res) {
          const archiveParam: ArchiveParameter = {
            uavName: item.uavNumber.toString(),
            communication: item.communication,
            parameterName: parameter,
            dataArchive: [],
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

        this.allArchivedParameters.set(
          this.selectedCOMM + '-' + parameter,
          allData
        );

        for (const item of res) {
          this.uavsData.set(
            item.uavNumber + item.communication,
            item.archiveDataPackets
          );
        }
      });
    } else {
      selectedParams.splice(paramIndex, 1);
    }

    uavMap.set(this.selectedCOMM, selectedParams);
    this.selectedParametersMap.set(this.selectedUAVs[0], uavMap);
  }

  public onPageChange(event: any): void {
    // console.log(event);

    this.pageNumber = Math.max(event.pageIndex + 1, 1);
    this.pageSize = event.pageSize;
    // this.reloadDataForAllParameters();
    this.groupDataForBackend();
  }

  public submitButton(): void {
    const prev = this.paginator.pageIndex;
    const size = this.paginator.pageSize;
    const total = this.paginator.length;

    const fakeEvent: PageEvent = {
      previousPageIndex: prev,
      pageIndex: prev,
      pageSize: size,
      length: total,
    };

    this.paginator.pageIndex = prev;
    this.paginator.pageIndex = prev - 1;
    this.paginator.pageSize = size;

    this.paginator.page.emit(fakeEvent);
  }

  private groupDataForBackend(): void {
    const uavs: string[] = [];
    const parameters: string[] = [];
    const communications: string[] = [];

    for (const [paramName, parameterArray] of this.allArchivedParameters) {
      for (const paramData of parameterArray) {
        const uavName = paramData.uavName;
        const communication = paramData.communication;

        if (!uavs.includes(uavName)) {
          uavs.push(uavName);
        }

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

  private reloadDataPagination(
    uavs: string[],
    parameters: string[],
    communications: string[]
  ): void {
    // console.log('Reloading data with:', { uavs, parameters, communications }); // Add this

    const rawStart = this.archiveDates.value.start as Date;
    const rawEnd = this.archiveDates.value.end as Date;
    if (!rawStart || !rawEnd) {
      Swal.fire({
        icon: 'warning',
        title: 'Warning',
        text: 'Please pick start dates',
      });
      return;
    }

    const start = new Date(rawStart);
    start.setHours(this.hours, this.minutes, 0, 0);
    const end = new Date(rawEnd);
    end.setHours(this.hours, this.minutes, 0, 0);

    communications.forEach((comm) => {
      // console.log('Processing communication:', comm); //
      const archiveRequest: ArchiveManyRequestDto = {
        StartDate: start,
        EndDate: end,
        UavNumbers: uavs.map(Number),
        Communication: comm,
        PageNumber: this.pageNumber,
        PageSize: this.pageSize,
        ParameterNames: parameters,
      };

      // console.log('Sending request:', archiveRequest); //

      this.archiveService.getMultiArchiveData(archiveRequest).subscribe({
        next: (response) => {
          // console.log('Received response for', comm); //
          this.processMultiArchiveResponse(response, comm);
        },
        error: (err) =>
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to fetch data. Please try again later.',
            footer: 'Error details: ' + err.message,
          }),
      });
    });
  }
  private processMultiArchiveResponse(response: any, comm: string): void {
    // New structure: { [parameter: string]: { [uavNumber: string]: DataEntry[] } }
    const paramTables: { [key: string]: { [uavNumber: string]: DataEntry[] } } =
      {};

    interface DataEntry {
      dateTime: Date;
      value: string;
    }
    // 1
    // console.log('[Processing] Raw response structure:', {
    //   responseType: Array.isArray(response) ? 'array' : typeof response,
    //   itemCount: response.length,
    //   firstItemKeys: response[0] ? Object.keys(response[0]) : null,
    // });

    response.forEach((uavData: any) => {
      const uavNumber = uavData.uavNumber.toString();

      // console.log(
      //   `[Processing] UAV ${uavNumber} has ${uavData.archiveDataPackets.length} packets`
      // );

      if (
        !uavData.archiveDataPackets ||
        uavData.archiveDataPackets.length === 0
      ) {
        this.toastService.warning(
          `No data packets for UAV ${uavNumber} in this dates.`
        );
        return;
      }
      uavData.archiveDataPackets.forEach((packet: any, packetIndex: number) => {
        Object.entries(packet.parameters).forEach(([paramName, paramValue]) => {
          // 2
          if (!paramTables[paramName]) {
            paramTables[paramName] = {};
            // console.log(`[Processing] New parameter detected: ${paramName}`);
          }

          // 3
          if (!paramTables[paramName][uavNumber]) {
            paramTables[paramName][uavNumber] = [];
            // console.log(
            //   `[Processing] New UAV ${uavNumber} for parameter ${paramName}`
            // );
          }

          // 4
          const entry: DataEntry = {
            dateTime: new Date(packet.dateTime),
            value: paramValue?.toString() || 'N/A',
          };
          paramTables[paramName][uavNumber].push(entry);

          // 5
          // if (packetIndex < 3) {
          //   console.log(
          //     `[Processing] First entries sample - UAV ${uavNumber} ${paramName}:`,
          //     JSON.stringify(entry)
          //   );
          // }
        });
      });
    });

    // 7
    // console.log('[Processing] Final parameter structure overview:');
    // Object.entries(paramTables).forEach(([param, uavData]) => {
    //   console.log(
    //     `Parameter: ${param.padEnd(10)} UAVs: ${Object.keys(uavData).length}`
    //   );
    //   Object.entries(uavData).forEach(([uav, entries]) => {
    //     console.log(
    //       `  UAV ${uav.padEnd(5)} Entries: ${entries.length} ` +
    //         `First: ${entries[0]?.dateTime.toISOString()} | ${
    //           entries[0]?.value
    //         }`
    //     );
    //   });
    // });

    // 8
    const legacyMap = new Map<string, any>();
    Object.entries(paramTables).forEach(([param, uavData]) => {
      const converted = Object.entries(uavData).map(([uav, data]) => ({
        uavName: uav,
        communication: comm,
        parameterName: param,
        dataArchive: data,
      }));

      legacyMap.set(`${comm}-${param}`, converted);
      // console.log(
      //   `[Legacy] Converted ${param} to ${converted.length} UAV entries`
      // );
    });

    // 9. Update class properties
    this.allArchivedParameters = legacyMap;
    // this.dataEvent.next(paramTables); // Emit both formats if needed

    // 10. Final verification log
    // console.log(
    //   '[Processing] Completed with:',
    //   `Parameters: ${Object.keys(paramTables).length}`,
    //   `UAVs: ${new Set(response.map((u: any) => u.uavNumber)).size}`
    // );
    this.processedData = paramTables;
  }

  // private reloadDataForAllParameters(): void {
  //   this.allArchivedParameters.forEach((_, key) => {
  //     const parts = key.split('-');
  //     if (parts.length < 2) return;
  //     const parameter = parts.slice(1).join('-');
  //     this.onChooseParameter(parameter);
  //   });
  // }

  public updateAllParameters(): void {
    this.allArchivedParameters.clear();
    this.uavsData.clear();
  }

  public onTimeChange(): void {
    if (this.selectedTime) {
      const [hours, minutes] = this.selectedTime.split(':');
      this.hours = parseInt(hours, 10);
      this.minutes = parseInt(minutes, 10);
      this.updateFormattedTime();
      console.log(1);
    }
  }

  private updateFormattedTime() {
    this.formattedTime = `${this.hours
      .toString()
      .padStart(2, '0')}:${this.minutes.toString().padStart(2, '0')}`;
  }

  public onSelectUAV(event: any): void {
    this.selectedUAVs = event.value;
    this.updateParametersArray();
  }

  private updateParametersArray() {
    if (this.selectedCOMM) {
      const type = this.selectedCOMM as Communication;
      this.parametersarray = this.parametersMap.get(type) || [];
    }
  }

  public onSelectCommunication(event: any): void {
    this.selectedCOMM = event.value;
    this.updateParametersArray();
    this.getCurrentParameters();
  }
}
