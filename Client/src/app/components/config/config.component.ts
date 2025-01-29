import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/apirepsonse';
import Swal from 'sweetalert2';
import { AddNewDialogComponent } from '../dialogs/add-new-dialog.component';
import { SimulatorService } from 'src/app/services/simulator.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  protected channel:string = '';
  protected port : number = 0;

  protected devices: string[] = ["test", "test"];
  protected pcaps: string[] = ["test"];
  protected fileName :string = '';

  Object = Object;
  protected uavsComm: { [key: string]: string } = {}; 

  constructor(private http: HttpClient , private simulatorservice:SimulatorService) {} // private dialog:MatDialog 

  ngOnInit(): void {
      this.SimulatorsCommunications();
  }


  protected SimulatorsCommunications ()
  {
    this.simulatorservice.PrimaryUavs().subscribe((response=>{
      console.log(response);
      this.uavsComm = response;
    }))
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
        this.SimulatorsCommunications(); 
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
  
  protected onFileSelected(event:any){

  }
  // protected openAddUavDialog():void{
  //   const dialogRef = this.dialog.open(AddNewDialogComponent,{width:'400px'})

  //   dialogRef.afterClosed().subscribe((result)=>{
  //     if(result){
  //       console.log('user enterd : ' , result);
  //     }
  //   })
  // }
  protected StartIcds(){
    
  }
  protected Pause(){

  }
  protected Continue(){

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

  
  
  // protected StartAll<T>() : Observable<ApiResponse<T>>{
  //   console.log('h');
  //   return this.http.get<ApiResponse<T>>(`http://localhost:5000/StartAll`);
  // }
  protected StartOne(){
    Swal.fire({
      title: 'Start Telemetry',
      html:
        `<input id="swal-uavNumber" class="swal2-input" placeholder="UAV Number">` +
        `<input id="swal-address" class="swal2-input" placeholder="Address">` +
        `<input id="swal-channel" class="swal2-input" placeholder="Channel">` +
        `<input id="swal-type" class="swal2-input" placeholder="Type">` +
        `<input id="swal-port" type="number" class="swal2-input" placeholder="Port">`,
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

        // Basic Validation
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
        const { uavNumber, address, channel, type, port } = result.value;
        // this.executeStartTelemetry(uavNumber, address, channel, type, port);
      }
    });
  }
    // Swal.fire({
    //   title:'Start channel listening',
    //   html:
    //   <label for="swal-firstinput">
    //   <input 
    //   input: 'text',
    //   inputLabel: 'Enter channel name',
    //   inputValue: this.channel,
    //   inputPlaceholder:'FiberBox',
      
    //   input: 'number',
    //   inputLabel: 'Enter port',
    //   inputValue: this.port,
    //   inputPlaceholder:'(6000-6005)',


    // });
   // http://localhost:5000/Start // channeldto - channel (string) , Type(string) , port (int)
  }
  // protected StopChannel(){
   // http://localhost:5000/Stop //body - port (int)
  // }
// }

// Swal.fire({
//   title: 'Enter Group Name',
//   input: 'text',
//   inputLabel: 'Group Name',
//   inputValue: this.GroupName,
//   showCancelButton: true,
//   confirmButtonText: 'Create',
//   showLoaderOnConfirm: true,
//   preConfirm: (groupName) => {
//     if (!groupName) {
//       Swal.showValidationMessage('Please enter a group name');
//       return;
//     }
//     this.GroupName = groupName;
//     return this.chatService.createChat(groupName).toPromise().then(() => {
//       this.signalrservice.creategroup(groupName);
//       this.newChat = '';
//     }).catch((err) => {
//       Swal.fire('Error', 'Something went wrong: ' + err, 'error');
//       console.error('Error creating chat', err);
//     });
//   },
//   allowOutsideClick: () => !Swal.isLoading()
// });