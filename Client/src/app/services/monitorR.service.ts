import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MonitorRService {
  private connection : signalR.HubConnection;
  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:9000/monitorhub').build();
  }

  public startConnection(): Observable<void> {
    return new Observable<void>((observer) => {
      this.connection
        .start()
        .then(() => {
          console.log('Connection established with SignalR hub');
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.error('Error connecting to SignalR hub:', error);
          observer.error(error);
        });
    });
  }

  public MonitorActiveMessage(): Observable<{ partition: string, status: string }> {
    return new Observable<{ partition: string, status: string }>((observer) => {
      this.connection.on('MonitorActive', (partition: { value: string; isSpecial: string }, status: string) => {
        console.log("Partition:", partition);
        console.log("Status:", status);
        observer.next({ partition: partition.value, status });
      });
    });
  }
  


  
}
