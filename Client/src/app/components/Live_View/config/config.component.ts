import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { SimulatorService } from 'src/app/services/simulator.service';
import { channeldto } from 'src/app/models/channeldto';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {

  protected pcaps: string[] = ["test"];
  protected fileName :string = '';

  Object = Object;
  protected uavsCommunications: { [key: string]: string } = {};
  protected uavsTelemetry: channeldto[] = [];
  

  constructor(private http: HttpClient , private simulatorservice:SimulatorService) {} 

  ngOnInit(): void {
      this.initData();
  }

  protected initData ()
  {
    this.simulatorservice.SimulatorPrimaryUavs().subscribe((response=>{
      this.uavsCommunications = response;
    }))
    
    this.simulatorservice.TelemetryUavs().subscribe((response)=>{
      console.log(response)
      this.uavsTelemetry = response;
    })
  }

  public SwitchCommunication(selectedUav: string) {
    console.log(selectedUav);
    this.simulatorservice.ChangePrimary(selectedUav).subscribe(
      (response) => {
        console.log('Primary UAV changed successfully:', response);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Primary Communicate changed successfully.',
          showConfirmButton: true,
          timer: 2000
        });
        this.initData(); 
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

  getCommunicationType(value: string): string {
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
  protected StartOne(){
    Swal.fire({
      title: 'Start Telemetry',
      html: 
      `
      <input
          id="swal-uavNumber"
          type="number"
          class="swal2-input"
          placeholder="UAV Number"
          min="1"
        />
        <input
          id="swal-address"
          type="text"
          class="swal2-input"
          placeholder="IP Address (127.0.0.1)"
        />
        <input
          id="swal-channel"
          type="text"
          class="swal2-input"
          placeholder="Channel (FiberBox/Mission)"
          list="channels"
        />
        <datalist id="channels">
          <option value="FiberBox"></option>
          <option value="Mission"></option>
        </datalist>
        <input
          id="swal-type"
          type="text"
          class="swal2-input"
          placeholder="Type (Up/Down)"
          list="types"
        />
        <datalist id="types">
          <option value="Up"></option>
          <option value="Down"></option>
        </datalist>
        <input
          id="swal-port"
          type="number"
          class="swal2-input"
          placeholder="Port (1-65535)"
        
        />
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Start',
      preConfirm: () => {
        const uavNumber = (document.getElementById('swal-uavNumber') as HTMLInputElement).value.trim();
        const address = (document.getElementById('swal-address') as HTMLInputElement).value.trim();
        const channel = (document.getElementById('swal-channel') as HTMLInputElement).value.trim();
        const type = (document.getElementById('swal-type') as HTMLInputElement).value.trim();
        const portInput = (document.getElementById('swal-port') as HTMLInputElement).value.trim();
        const port = Number(portInput);

        if (!uavNumber) {
          Swal.showValidationMessage('Please enter UAV Number.');
          return;
        }

        if (!address) {
          Swal.showValidationMessage('Please enter Address.');
          return;
        }

        if (!channel) {
          Swal.showValidationMessage('Please enter Channel.');
          return;
        }

        if (!type) {
          Swal.showValidationMessage('Please enter Type.');
          return;
        }

        if (!portInput || isNaN(port) || port < 1 || port > 65535) {
          Swal.showValidationMessage('Please enter a valid Port (1-65535).');
          return;
        }

        return { uavNumber, address, channel, type, port };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.simulatorservice.StartSimulate(result.value).subscribe((response)=>{
          
          Swal.fire({
            icon: 'success',
            title: 'Opened Channel',
            text: 'Simulator and Telemetry starting!',
          })         
        },

        (error)=>{
          console.log(error)
          if(error.status === 500)
          {
            Swal.fire({
              icon: 'error',
              title: 'Error open simulator',
              text: 'Failed to start Simulate.',
            })
          }
           if(error.status === 409)
          {
            Swal.fire({
              icon: 'info',
              title: 'Error open simulator',
              text: error.message,
            })
          }
           });
          }
        });
  }
  
  protected pauseTelemetry(address : string , port:number) {

    this.simulatorservice.pauseTelemetry(port,address).subscribe(
      (response) => {
        console.log('Paused listening', response);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Channel has been paused.',
          showConfirmButton: true,
          timer: 2000
        });
        this.initData(); 
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

  protected continueTelemetry(address:string,port:number){
    this.simulatorservice.continueListening(port,address).subscribe(
      (response) => {
        console.log('Continue listening', response);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Channel now listening.',
          showConfirmButton: true,
          timer: 2000
        });
        this.initData(); 
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

  protected deleteTelemetry(address:string,port:number){
    this.simulatorservice.deleteChannel(port,address).subscribe(
      (response) => {
        console.log('Channel Removed', response);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Channel has been removed.',
          showConfirmButton: true,
          timer: 2000
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


  protected StartIcds(){
    
  }


  protected StartSimulator() {
    return this.http.get(`http://localhost:7000/StartFetching`);
  }
  protected StartPcap(){
    return this.http.get(`http://localhost:7000/StartPcap`);
  }
  protected Stop(){
    return this.http.get(`http://localhost:7000/Stop`);
  }
  
  protected onFileSelected(event:any){

  }

 
}
