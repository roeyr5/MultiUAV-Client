import { Component, OnDestroy, OnInit } from '@angular/core';
import { MonitorRService } from 'src/app/services/monitorR.service';
import { SimulatorService } from 'src/app/services/simulator.service';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit,OnDestroy {

  public activeUavs: { [uavNumber: number]: {  [partition: number]: number } } = {};

  constructor(private monitorservice: MonitorRService, private simulatorService: SimulatorService){}
  
  public ngOnInit(): void 
  {
    this.loadUavsFromLocalStorage();
    this.startConnection();
  }

  private startConnection()
  {
   this.monitorservice.startConnection().subscribe((response)=>{

    this.monitorservice.monitorActiveMessage().subscribe((data)=>{
      for (let uav in data) {
        this.activeUavs[uav] = data[uav];
      }     
    });
  });
  }

  protected getUavs(): void {
    // console.log(1)
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

  private loadUavsFromLocalStorage(): void {
    const storedUavs = localStorage.getItem('activeUavs');
    if (storedUavs) {
      this.activeUavs = JSON.parse(storedUavs);
    }
  }

  private saveUavsToLocalStorage(): void {
    localStorage.setItem('activeUavs', JSON.stringify(this.activeUavs));
  }

  ngOnDestroy(): void {
    this.saveUavsToLocalStorage(); 
  }
}

