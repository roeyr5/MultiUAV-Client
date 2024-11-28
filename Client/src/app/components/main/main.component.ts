import { Component , OnInit } from '@angular/core';
import { SignalRService } from 'src/app/services/signalr.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  
  public receivedmessage:string = '';
  protected parametersarray:string[]=[];
  
  constructor(private signalRService : SignalRService , private userservice:UserService){}

  public ngOnInit(): void {
      this.signalRService.startConnection().subscribe((response)=>{
        console.log("worked signalR");
        this.signalRService.receiveMessage().subscribe((message)=>{
          this.receivedmessage=message;
        });
      });

      this.GetParameters();
  }

  protected sendMessage(message: string): void {
    this.signalRService.sendMessage(message);
  }

  protected GetParameters(){    
    this.userservice.list().subscribe((res)=>{
      this.parametersarray=res;
    },(err) =>{
      console.error("error" , err);
    }
    )
  }
}
