import { Component, OnInit } from '@angular/core';
import { MonitorRService } from 'src/app/services/monitorR.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { UserService } from 'src/app/services/user.service';
import { KeyValue, KeyValuePipe } from '@angular/common';
import { map } from 'rxjs';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  
  public receivedmessage:string = 'UnActive';
  public activeUavs = new Map<string,string>();

  constructor(private  monitorservice: MonitorRService , private userservice:UserService ){}
  
  public ngOnInit(): void 
  {
    this.StartConnection();
  }

  private StartConnection()
  {
   this.monitorservice.startConnection().subscribe((response)=>{
    console.log("worked signalR");

    this.monitorservice.MonitorActiveMessage().subscribe((message)=>{
      this.activeUavs.set(message.partition,message.status);
    });
  });
  }

  protected get UavsAsarray(){
    return Array.from(this.activeUavs.entries());
  }
  
  //red , green in monitor
}
