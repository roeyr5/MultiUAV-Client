import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  OrchestratorService,
  OrchestratorUpdatePayload,
  SimulatorReassign,
} from 'src/app/services/orchestrator.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orchestrator',
  templateUrl: './orchestrator.component.html',
  styleUrls: ['./orchestrator.component.css'],
})
export class OrchestratorComponent implements OnInit,OnDestroy {
  constructor(private orchestratorService: OrchestratorService,private toastrService : ToastrService
  ) {}

  objectKeys = Object.keys;

  public orchestratorData: OrchestratorUpdatePayload = {};
  private subscriptions = new Subscription();

  public ngOnInit(): void {
    this.loadDevicesFromLocalStorage();
    this.startConnection();
  }

  private startConnection(): void {
    this.subscriptions.add(
      this.orchestratorService.startConnection().subscribe({
        next: () => {

          this.subscriptions.add(
            this.orchestratorService.listenToOrchestratorEvents().subscribe({
              next: (data) => {
                this.orchestratorData = data;
                console.log('Data received:', data);
              },
              error: (err) => console.error('Listen error:', err)
            })
          );

          this.subscriptions.add(
            this.orchestratorService
              .newAssignmentEvent()
              .subscribe({
                next: (assignment: SimulatorReassign) => {
                  this.newAssign(assignment);
                  },
                error: (err) =>
                  console.error('Assignment event error:', err)
              })
          );
          this.subscriptions.add(
            this.orchestratorService
              .newDeviceEvent()
              .subscribe({
                next: (deviceId: number) => {
                  this.newDevice(deviceId);
                },
                error: (err) =>
                  console.error('New device event error:', err)
              })
          );
        },
        error: (err) => console.error('Connection error:', err)
      })
    );
  }

  public get totalDevices(): number {
    return Object.keys(this.orchestratorData).length;
  }

  public get activeUAVs(): number {
    return Object.values(this.orchestratorData)
      .reduce((sum, entry) => sum + (entry.simulators?.length || 0), 0);
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.orchestratorService.stopConnection();
    this.saveDevicesToLocalStorage();
  }

  public newAssign(assignment:SimulatorReassign):void{
    console.log(assignment);
    
    this.toastrService.info(
      `ReAssignment Uav Number #${assignment.uavNumber} from device "${assignment.oldDeviceId}" to "${assignment.newDeviceId}"`,
      'New Assignment'
    );
  }

  public newDevice(deviceId:number):void{
    this.toastrService.info(
      `New Telemetry Device created with process id : "${deviceId}"`)
  }

  private saveDevicesToLocalStorage(): void {
    localStorage.setItem('activeDevices', JSON.stringify(this.orchestratorData));
  }

  private loadDevicesFromLocalStorage(): void {
    const storedUavs = localStorage.getItem('activeDevices');
    if (storedUavs) {
      this.orchestratorData = JSON.parse(storedUavs);
    }
  }

}
