import { HttpClient, HttpStatusCode } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { SimulatorService } from 'src/app/services/simulator.service';
import { channeldto } from 'src/app/entities/models/channeldto';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatTooltip } from '@angular/material/tooltip';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CommonModule,
    FormsModule,
  ],
})
export class ConfigComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  isExpanded = false;
  // subpannel;
  panelOpenState = false;
  dataSource: channeldto[] = [];

  protected uavsTimeSimulate: { [key: number]: number } = {};
  protected uavsCommunications: { [key: string]: string } = {};
  protected uavsTelemetry: Map<number, channeldto[]>;
  expandedUAV: number | null = null;

  constructor(
    private http: HttpClient,
    private simulatorservice: SimulatorService
  ) {
    this.uavsTelemetry = new Map<number, channeldto[]>();
  }

  ngOnInit(): void {
    this.initData();
  }

  toggleAccordion() {
    if (this.isExpanded) {
      this.accordion.closeAll();
    } else {
      this.accordion.openAll();
    }
    this.isExpanded = !this.isExpanded;
  }

  protected initData() {
    this.simulatorservice.simulatorPrimaryUavs().subscribe((response) => {
      this.uavsCommunications = response;
    });

    this.simulatorservice.simulatorTimes().subscribe((res) => {
      this.uavsTimeSimulate = res;
    });

    this.simulatorservice.telemetryUavs().subscribe((response) => {
      this.uavsTelemetry = response;
      console.log(response);
    });
  }

  public SwitchCommunication(selectedUav: number) {
    this.simulatorservice.changePrimary(selectedUav).subscribe(
      (response) => {
        console.log('Primary UAV changed successfully:', response);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Primary Communicate changed successfully.',
          showConfirmButton: true,
          timer: 2000,
        });
        this.uavsCommunications[selectedUav] = this.toggleCommunicationType(
          this.uavsCommunications[selectedUav]
        );
      },
      (error) => {
        console.error('Error changing primary UAV:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to change primary UAV.',
        });
      }
    );
  }

  protected toggleEditable(input: HTMLInputElement, key: number): void {
    if (input.readOnly) {
      input.readOnly = false;
      input.focus();
    } else {
      input.readOnly = true;
      this.updateSimulateTime(key, this.uavsTimeSimulate[key]);
    }
  }
  protected updateSimulateTime(key: number, newTime: number): void {
    if (newTime < 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Time cannot be less than 0',
      });
      return;
    }
    this.simulatorservice.updateSimulating(key, newTime).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Update simulate time!',
          showConfirmButton: true,
          timer: 2000,
        });
        this.uavsTimeSimulate[key] = newTime;
        // this.initData();
      },
      (error) => {
        console.error('Error change the simulate UAV:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to Pause UAV.',
        });
      }
    );
  }

  protected toggleCommunicationType(value: string): string {
    console.log(value);

    if (value == '0') {
      return '1';
    } else if (value == '1') {
      return '0';
    } else {
      return 'Unknown';
    }
  }
  protected getCommunicationType(value: string): string {
    if (value === undefined) {
      return 'Unknown';
    }
    switch (value) {
      case '0':
        return 'FiberBox';
      case '1':
        return 'Mission';
      default:
        return 'Unknown';
    }
  }
  //   protected StartOne() {
  //     Swal.fire({
  //         title: 'Start Telemetry',
  //         html: `
  //           <button id="random-button" class="swal2-confirm swal2-styled">Generate Random Values</button>

  //         <input
  //             id="swal-uavNumber"
  //             type="number"
  //             class="swal2-input"
  //             placeholder="Tail Number"
  //             min="1"
  //         />
  //         <input
  //             id="swal-address"
  //             type="text"
  //             class="swal2-input"
  //             placeholder="IP Address (127.0.0.1)"
  //         />
  //         <input
  //             id="swal-port"
  //             type="number"
  //             class="swal2-input"
  //             placeholder="Start Port (1-65535)"
  //         />
  //         `,
  //         focusConfirm: false,
  //         showCancelButton: true,
  //         confirmButtonText: 'Start',
  //         preConfirm: () => {
  //             const uavNumberInput = (
  //                 document.getElementById('swal-uavNumber') as HTMLInputElement
  //             ).value.trim();
  //             const uavNumber = Number(uavNumberInput);
  //             const address = (
  //                 document.getElementById('swal-address') as HTMLInputElement
  //             ).value.trim();
  //             const portInput = (
  //                 document.getElementById('swal-port') as HTMLInputElement
  //             ).value.trim();
  //             const port = Number(portInput);

  //             if (!uavNumber) {
  //                 Swal.showValidationMessage('Please enter Tail Number.');
  //                 return;
  //             }

  //             if (!address) {
  //                 Swal.showValidationMessage('Please enter Address.');
  //                 return;
  //             }

  //             if (!portInput || isNaN(port) || port < 1 || port > 65535) {
  //                 Swal.showValidationMessage('Please enter a valid Port (1-65535).');
  //                 return;
  //             }

  //             return { uavNumber, address, port };
  //         },
  //     }).then((result) => {
  //         if (result.isConfirmed && result.value) {
  //             this.simulatorservice.startSimulate(result.value).subscribe(
  //                 (response) => {
  //                     this.initData();

  //                     Swal.fire({
  //                         icon: 'success',
  //                         title: 'Opened Channel',
  //                         text: 'Simulator and Telemetry starting!',
  //                     });
  //                 },
  //                 (error) => {
  //                     console.log(error);
  //                     if (error.status === 500) {
  //                         Swal.fire({
  //                             icon: 'error',
  //                             title: 'Error open simulator',
  //                             text: 'Failed to start Simulate.',
  //                         });
  //                     }
  //                     else if (error.status === 409) {
  //                         Swal.fire({
  //                             icon: 'info',
  //                             title: 'Error open simulator',
  //                             text: error.error.message,
  //                         });
  //                     }

  //                 }
  //             );
  //         }
  //     });

  //     const randomButton = document.getElementById('random-button');
  //     if (randomButton) {
  //         randomButton.addEventListener('click', () => {
  //             const randomPort = Math.floor(Math.random() * (10000 - 1024 + 1)) + 1024;
  //             const randomUav = Math.floor(Math.random() * 1000) + 1;
  //             const randomIp = '127.0.0.1';

  //             // Populate inputs with random values
  //             (document.getElementById('swal-uavNumber') as HTMLInputElement).value = randomUav.toString();
  //             (document.getElementById('swal-address') as HTMLInputElement).value = randomIp;
  //             (document.getElementById('swal-port') as HTMLInputElement).value = randomPort.toString();
  //         });
  //     }
  // }

  protected pauseTelemetry(channelDto: channeldto) {
    this.simulatorservice
      .pauseTelemetry(channelDto.uavNumber, channelDto.channel)
      .subscribe(
        (response) => {
          console.log('Paused listening', response);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Channel has been paused.',
            showConfirmButton: true,
            timer: 2000,
          });
          channelDto.status = !channelDto.status;
        },
        (error) => {
          console.error('Error pausing UAV:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to Pause UAV.',
          });
        }
      );
  }

  protected continueTelemetry(channelDto: channeldto) {
    this.simulatorservice
      .continueListening(channelDto.uavNumber, channelDto.channel)
      .subscribe(
        (response) => {
          console.log('Continue listening', response);
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Channel now listening.',
            showConfirmButton: true,
            timer: 2000,
          });
          channelDto.status = !channelDto.status;
        },
        (error) => {
          console.error('Error continue listening UAV:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to continue listening .',
          });
        }
      );
  }

  protected deleteTelemetry(address: string, port: number, pcap?: boolean) {
    console.log(pcap);
    this.simulatorservice.deleteChannel(port, address, pcap!).subscribe(
      (response) => {
        console.log('Channel Removed', response);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Channel has been removed.',
          showConfirmButton: true,
          timer: 2000,
        });
        this.initData();
      },
      (error) => {
        console.error('Error remove channel:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to remove channel .',
        });
      }
    );
  }

  protected openFileSelector(): void {
    Swal.fire({
      title: 'Select a File',
      html: `
        <input type="file" id="file-input" />
        <br/><br/>
        <label for="uav-number">UAV Number:</label>
        <select id="uav-number" class="swal2-select">
          <option value="">UAV Number</option>
          <option value=100>100</option>
          <option value=200>200</option>
          <option value=240>240</option>
        </select>
        <br/><br/>
      `,
      showCancelButton: true,
      confirmButtonText: 'Upload',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const fileInput = document.getElementById(
          'file-input'
        ) as HTMLInputElement;
        const file = fileInput?.files?.[0];

        const uavSelect = document.getElementById(
          'uav-number'
        ) as HTMLSelectElement;

        const uavNumberString = uavSelect?.value;
        const uavNumber = Number(uavNumberString);

        if (!uavNumber || !file) {
          Swal.showValidationMessage(
            'Please select all options: File , UAV Number, Communication, and Type'
          );
          return;
        }
        console.log(file.name);
        this.startPcap(file.name, uavNumber);
      },
    });
  }

  protected startPcap(fileName: string, uavNumber: number) {
    this.simulatorservice.startPcap(fileName, uavNumber).subscribe(
      (response) => {
        console.log('Starting pcap history ', response);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Pcap data starting.',
          showConfirmButton: true,
          timer: 2000,
        });
        this.initData();
      },
      (error) => {
        console.error('Error start the pcap :', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to start pcap  .',
        });
      }
    );
  }

  protected openCombinedModal(): void {
    Swal.fire({
      title: 'Connect Device',
      html: `
        <!-- Device Type Selector -->
        <select id="deviceType" class="swal2-select" style="margin-bottom: 1rem;">
          <option value="regular">Regular Device</option>
          <option value="pcap">PCAP Device</option>
        </select>
        
        <div id="regularInputs">
          <input
            id="swal-uavNumber"
            type="number"
            class="swal2-input"
            placeholder="Tail Number"
            min="1"
          />
        </div>
        
        <div id="pcapInputs" style="display:none;">
          <input
            id="uav-number"
            type="number"
            class="swal2-input"
            placeholder="Tail Number"
            min="1"
          />
          <input type="file" id="file-input" class="swal2-input" />
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Connect',
      cancelButtonText: 'Cancel',
      didOpen: () => {
        const deviceTypeSelect = document.getElementById(
          'deviceType'
        ) as HTMLSelectElement;
        deviceTypeSelect.addEventListener('change', () => {
          const regularInputs = document.getElementById(
            'regularInputs'
          ) as HTMLElement;
          const pcapInputs = document.getElementById(
            'pcapInputs'
          ) as HTMLElement;
          if (deviceTypeSelect.value === 'regular') {
            regularInputs.style.display = 'block';
            pcapInputs.style.display = 'none';
          } else {
            regularInputs.style.display = 'none';
            pcapInputs.style.display = 'block';
          }
        });

        // Add event listener for the random button
        const randomButton = document.getElementById('random-button');
        if (randomButton) {
          randomButton.addEventListener('click', () => {
            const randomPort =
              Math.floor(Math.random() * (10000 - 1024 + 1)) + 1024;
            const randomUav = Math.floor(Math.random() * 1000) + 1;
            const randomIp = '127.0.0.1';

            // Populate the fields with random values
            (
              document.getElementById('swal-uavNumber') as HTMLInputElement
            ).value = randomUav.toString();
            // (document.getElementById('swal-address') as HTMLInputElement).value = randomIp;
            // (document.getElementById('swal-port') as HTMLInputElement).value = randomPort.toString();
          });
        }
      },
      preConfirm: () => {
        const deviceType = (
          document.getElementById('deviceType') as HTMLSelectElement
        ).value;

        if (deviceType === 'regular') {
          // Regular Device validation
          const uavNumberInput = (
            document.getElementById('swal-uavNumber') as HTMLInputElement
          ).value.trim();
          const uavNumber = Number(uavNumberInput);
          // const address = (document.getElementById('swal-address') as HTMLInputElement).value.trim();
          // const portInput = (document.getElementById('swal-port') as HTMLInputElement).value.trim();
          // const port = Number(portInput);

          // if (!uavNumber) {
          //   Swal.showValidationMessage('Please enter Tail Number.');
          //   return;
          // }
          if (uavNumber < 1 || uavNumber > 255) {
            Swal.showValidationMessage(
              'UAV Number must be between 1 and 255.'
            );
            return;
          }
          // if (!address) {
          //   Swal.showValidationMessage('Please enter Address.');
          //   return;
          // }
          // if (!portInput || isNaN(port) || port < 1 || port > 65535) {
          //   Swal.showValidationMessage('Please enter a valid Port (1-65535).');
          //   return;
          // }

          return { deviceType, uavNumber };
        } else {
          // PCAP Device validation
          const fileInput = document.getElementById(
            'file-input'
          ) as HTMLInputElement;
          const file = fileInput?.files?.[0];
          const tailNumberInput = document.getElementById(
            'uav-number'
          ) as HTMLInputElement;
          const tailNumberString = tailNumberInput?.value.trim();

          if (!file || !tailNumberString) {
            Swal.showValidationMessage(
              'Please select a file and enter a Tail Number.'
            );
            return;
          }

          const uavNumber = Number(tailNumberString);
          return { deviceType, fileName: file.name, uavNumber };
        }
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const data = result.value;
        console.log(data);

        this.simulatorservice.startSimulate(data).subscribe(
          (response) => {
            this.initData();
            Swal.fire({
              icon: 'success',
              title: 'Opened Channel',
              text: 'Simulator and Telemetry starting!',
            });
          },
          (error) => {
            console.error(error);
            if (error.status === 500) {
              Swal.fire({
                icon: 'error',
                title: 'Error opening simulator',
                text: 'Failed to start Simulate.',
              });
            } else if (error.status === 409) {
              Swal.fire({
                icon: 'info',
                title: 'Error opening simulator',
                text: error.error.message,
              });
            } else if (error) {
              Swal.fire({
                icon: 'info',
                title: 'Server down',
              });
            }
          }
        );
        // Handle PCAP Device logic
      }
    });
  }

  private saveToLocalStorage(): void {
    localStorage.setItem(
      'uavsSettings',
      JSON.stringify(this.uavsCommunications)
    );
  }

  private loadUavsComm(): void {
    const storedSet = localStorage.getItem('uavsSettings');
    if (storedSet) this.uavsCommunications = JSON.parse(storedSet);
  }
  ngOnDestroy(): void {
    this.saveToLocalStorage();
  }
}
