import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PresetItem } from 'src/app/entities/models/presetItem';
import { UserService } from 'src/app/services/user.service';
import { createPresetDto } from 'src/app/entities/models/presetItem';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preset-parameters',
  templateUrl: './preset-parameters.component.html',
  styleUrls: ['./preset-parameters.component.css']
})
export class PresetParametersComponent implements OnInit {

  constructor(private userservice:UserService){}

  protected uavsNumbersPerPreset: Map<string, number[]> = new Map();
  protected allPresets: createPresetDto[] = [];
  protected isClicked: boolean = false;

  @Output() public onPresetSelect: EventEmitter<createPresetDto> = new EventEmitter<createPresetDto>();
  @Output() public onNewPreset: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    this.initPresets();
    this.initUavsPresets();
  }

  public initPresets():void
  {
    const email = localStorage.getItem('email');
    if(email !== null){
      this.userservice.getUserPresets(email).subscribe((res)=>{
        this.allPresets = res;
         
        this.allPresets.forEach((preset) => {
        this.getUavsNumbersPerPreset(preset);
        }); 
      });
     
    }
  }

  public initUavsPresets():void{
    console.log(this.allPresets);
    
  }

  public getUavsNumbersPerPreset(preset:createPresetDto) : void{
    let hashSet = new Set<number>();
    console.log(preset);
    

    for (const element of preset.presetItem) {
      element.telemetryItems.forEach((item) => {
        hashSet.add(item.parameter.uavNumber);
      })
    }
    const sortedUavNumbers = Array.from(hashSet).sort((a, b) => a - b);
    this.uavsNumbersPerPreset.set(preset.presetName, sortedUavNumbers);
    
  }

  public createNewPreset():void{
    this.onNewPreset.emit(); 
  }

  public navigateToPreset(presetItem : createPresetDto):void{
    this.onPresetSelect.emit(presetItem);
    //navigate to live with the specific preste 
  }

  public deletePreset(presetItem: createPresetDto): void {
    const email = localStorage.getItem('email');
    if (email !== null) {
      presetItem.email = email;
    }

    Swal.fire({
      title: 'Are you sure you want delete the preset?',
      text: "You won't be able to revert this action!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.userservice.deletePreset(presetItem).subscribe((res) => {
          console.log("karni : ", res);
          this.initPresets(); 
        });
      } else {
        console.log("Deletion cancelled");
      }
    });
}

}
