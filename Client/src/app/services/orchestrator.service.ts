import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';
import { SimulatorInfo, TelemetryDeviceInfo } from '../entities/models/orchestratorEntity';

export interface OrchestratorUpdatePayload {
  [telemetryDeviceId: number]: {
    device: TelemetryDeviceInfo;
    simulators: SimulatorInfo[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class OrchestratorService {
  private connection!: signalR.HubConnection;
  private retryTimeout = 1000;
  private maxRetryTimeout = 30000;
  private isManualDisconnect = false;

  private connectionStatus = new Subject<boolean>();
  public connectionStatus$ = this.connectionStatus.asObservable();
  

  private timeoutPromise = (ms: number) =>
    new Promise((_, reject) => setTimeout(() => reject('Timeout'), ms));

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5000/livehub', {
        transport: signalR.HttpTransportType.WebSockets, // Force WebSockets
        skipNegotiation: true // Skip negotiation if using WebSockets exclusively
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          return Math.min(retryContext.previousRetryCount * 2, this.maxRetryTimeout);
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Handle connection close events
    this.connection.onclose((error) => {
      if (!this.isManualDisconnect) {
        console.error('Connection closed. Reconnecting...', error);
        this.retryConnection();
      }
    });
  }

  public startConnection(): Observable<void> {
    return new Observable((observer) => {
      this.connection.start()
        .then(() => {
          this.connectionStatus.next(true);
          observer.next();
          observer.complete();
        })
        .catch((err) => {
          this.connectionStatus.next(false);
          observer.error(err);
          this.retryConnection();
        });
    });
  }

  private retryConnection(): void {
    setTimeout(() => {
      this.startConnection().subscribe({
        error: () => {
          this.retryTimeout = Math.min(this.retryTimeout * 2, this.maxRetryTimeout);
          this.retryConnection();
        }
      });
    }, this.retryTimeout);
  }

  public listenToOrchestratorEvents(): Observable<OrchestratorUpdatePayload> {
    return new Observable((observer) => {
      this.connection.on('OrchestratorUpdate', (data: OrchestratorUpdatePayload) => {
        observer.next(data);
      });
    });
  }

  public stopConnection(): void {
    this.isManualDisconnect = true;
    this.connection.stop();
  }
}

