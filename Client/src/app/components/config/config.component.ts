import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/models/apirepsonse';
import Swal from 'sweetalert2';
import { AddNewDialogComponent } from '../dialogs/add-new-dialog.component';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent implements OnInit {
  protected channel:string = '';
  protected port : number = 0;

  devices: string[] = ["test","test"];
  pcaps: string[] = ["test"];
  fileName :string = '';


  constructor(private http: HttpClient , private userservice:UserService) {} // private dialog:MatDialog 

  ngOnInit(): void {
      
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
  protected StopChannel(){
   // http://localhost:5000/Stop //body - port (int)
  }
}

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