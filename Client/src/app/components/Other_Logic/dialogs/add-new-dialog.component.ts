import { Component, inject, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { UserService } from 'src/app/services/user.service';
import {
  MAT_DIALOG_DATA,
  // MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-dialog',
  templateUrl: './add-new-dialog.component.html',
  styleUrls: ['./add-new-dialog.component.css'],
  
})
export class AddNewDialogComponent {

  // readonly dialog = inject(MatDialog);

  public uavs: string[] = []; 
  public selectedUav: string = ''; 
  public address: string = ''; 
  public port: string = ''; 

  constructor(
    private dialogRef: MatDialogRef<AddNewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userservice: UserService
  ) 
  {
    this.loadUavs();
  }

  public async loadUavs() {
    this.userservice.uavslist().subscribe((res)=>{
      this.uavs = res;
      console.log(res);
    })  
  }
  

  public submit(): void {
    const result = {
      selectedUav: this.selectedUav,
      address: this.address,
      port: this.port,
    };
    this.dialogRef.close(result); 
  }

  public cancel(): void {
    this.dialogRef.close(); 
  }
  // openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
  //   this.dialogRef.open(DialogAnimationsExampleDialog, {
  //     width: '250px',
  //     enterAnimationDuration,
  //     exitAnimationDuration,
  //   });
  // }

}
