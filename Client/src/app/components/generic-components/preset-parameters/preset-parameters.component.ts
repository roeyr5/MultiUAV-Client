import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PresetItem } from 'src/app/entities/models/presetItem';
import { UserService } from 'src/app/services/user.service';
import { createPresetDto } from 'src/app/entities/models/presetItem';

@Component({
  selector: 'app-preset-parameters',
  templateUrl: './preset-parameters.component.html',
  styleUrls: ['./preset-parameters.component.css']
})
export class PresetParametersComponent implements OnInit {

  constructor(private userservice:UserService){}

  protected allPresets: createPresetDto[] = [];
  protected isClicked: boolean = false;

  @Output() public onPresetSelect: EventEmitter<createPresetDto> = new EventEmitter<createPresetDto>();
  @Output() public onNewPreset: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {
    this.initPresets();
  }

  public initPresets():void
  {
    const email = localStorage.getItem('email');
    if(email !== null){
      this.userservice.getUserPresets(email).subscribe((res)=>{
        this.allPresets = res;
        console.log("karni : " , this.allPresets);
        // this.allPresets = res.
      });
    }
  }

  public createNewPreset():void{
    this.onNewPreset.emit(); 
  }

  public navigateToPreset(presetItem : createPresetDto):void{
    this.onPresetSelect.emit(presetItem);
    //navigate to live with the specific preste 
  }
  public deletePreset(presetItem : createPresetDto):void{
    this.userservice.deletePreset(presetItem).subscribe((res)=>{
      console.log("karni : " , res);
      this.initPresets();
    });
  }
}
