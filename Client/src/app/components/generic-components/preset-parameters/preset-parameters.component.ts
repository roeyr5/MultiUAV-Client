import { Component, OnInit } from '@angular/core';
import { PresetItem } from 'src/app/entities/models/presetItem';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-preset-parameters',
  templateUrl: './preset-parameters.component.html',
  styleUrls: ['./preset-parameters.component.css']
})
export class PresetParametersComponent implements OnInit {

  constructor(private userservice:UserService){}

  protected allPresets: PresetItem[] = [];

  ngOnInit(): void {
    this.initPresets();
  }

  public initPresets():void
  {
    const email = localStorage.getItem('email');
    if(email !== null){
      this.userservice.getUserPresets(email).subscribe((res)=>{
        console.log("karni : " ,res);
        // this.allPresets = res.
      });
    }
   
  }

  public createNewPreset():void{

  }

  public navigateToPreset(presetItem : PresetItem):void{
    //navigate to live with the specific preste 
  }
}
