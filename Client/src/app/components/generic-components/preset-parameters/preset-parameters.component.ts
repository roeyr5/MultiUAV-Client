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

  @Output() public onPresetSelect: EventEmitter<PresetItem[]> = new EventEmitter<PresetItem[]>();
  

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

  }

  public navigateToPreset(presetItem : PresetItem[]):void{
    this.onPresetSelect.emit(presetItem);
    //navigate to live with the specific preste 
  }
}
