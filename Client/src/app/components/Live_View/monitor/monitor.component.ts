import { Component, OnInit } from '@angular/core';
import { MonitorRService } from 'src/app/services/monitorR.service';
import { SimulatorService } from 'src/app/services/simulator.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {

  public activeUavs: { [uavNumber: number]: {  [partition: number]: number } } = {};

  constructor(private monitorservice: MonitorRService, private simulatorService: SimulatorService){}
  
  public ngOnInit(): void 
  {
    this.StartConnection();
  }

  private StartConnection()
  {
   this.monitorservice.startConnection().subscribe((response)=>{
    // console.log("worked signalR");

    this.monitorservice.MonitorActiveMessage().subscribe((data)=>{
      // console.log("Received Dictionary:", data);
      for (let uav in data) {
        // console.log(`Uav Number: ${uav}, partitions count data :`, data[uav]);
        this.activeUavs[uav] = data[uav];
      }     
      //  this.activeUavs.set(message.partition,message.status);
    });
  });
  }

  protected getUavs(): void {
    console.log(1)
    this.simulatorService.telemetryUavs().subscribe(
      (res) => {
        console.log(res)
        res.forEach((channels, uavNumber) => {
          if (!this.activeUavs[uavNumber]) {
            this.activeUavs[uavNumber] = { 0: 0, 1: 0, 2: 0, 3: 0 };
          }
          console.log(this.activeUavs)
          console.log(res)
        }
    );
    })
  }
  
  protected getStatus(value: number): string {
    return value > 0 ? 'green' : 'red';
  }
}

