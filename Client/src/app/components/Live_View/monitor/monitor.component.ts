import { Component, OnInit } from '@angular/core';
import { MonitorRService } from 'src/app/services/monitorR.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  public activeUavs: { 
    [uavNumber: string]: { 
        [partition: number]: number } } = {
    "100": {
        0:3,
        1: 1,
        2: 0,
        3:2
    },
    "200": {
        0:1,
        1: 2,
        2:3,
        3: 3,
    }
};
  constructor(private  monitorservice: MonitorRService){}
  
  public ngOnInit(): void 
  {
    this.StartConnection();
  }

  private StartConnection()
  {
   this.monitorservice.startConnection().subscribe((response)=>{
    console.log("worked signalR");

    this.monitorservice.MonitorActiveMessage().subscribe((data)=>{
      console.log("Received Dictionary:", data);
      for (let uav in data) {
        console.log(`Uav Number: ${uav}, partitions count data :`, data[uav]);
        this.activeUavs[uav] = data[uav];
      }     
      //  this.activeUavs.set(message.partition,message.status);
    });
  });
  }
  
  getStatus(value: number): string {
    return value > 0 ? 'green' : 'red';
  }
}

