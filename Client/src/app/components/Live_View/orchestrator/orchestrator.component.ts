import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  OrchestratorService,
  OrchestratorUpdatePayload,
} from 'src/app/services/orchestrator.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-orchestrator',
  templateUrl: './orchestrator.component.html',
  styleUrls: ['./orchestrator.component.css'],
})
export class OrchestratorComponent implements OnInit,OnDestroy {
  constructor(private orchestratorService: OrchestratorService) {}

  objectKeys = Object.keys;

  public orchestratorData: OrchestratorUpdatePayload = {};
  private subscriptions = new Subscription();

  public ngOnInit(): void {
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
  }
}
