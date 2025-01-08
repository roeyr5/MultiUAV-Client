import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-new-dialog',
  templateUrl: './add-new-dialog.component.html',
  styleUrls: ['./add-new-dialog.component.css']
})
export class AddNewDialogComponent {

  public uavs: string[] = []; 
  public selectedUav: string = ''; 
  public address: string = ''; 
  public port: string = ''; 

  constructor(
    private dialogRef: MatDialogRef<AddNewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: YourService
  ) {
    this.loadUavs();
  }

  async loadUavs() {
    this.uavs = await this.service.getUavs(); // Fetch data from MongoDB
  }

  submit(): void {
    const result = {
      selectedUav: this.selectedUav,
      variable1: this.variable1,
      variable2: this.variable2,
    };
    this.dialogRef.close(result); // Send data back to the parent component
  }

  cancel(): void {
    this.dialogRef.close(); // Close dialog without any data
  }
}
