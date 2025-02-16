import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Observer, partition } from 'rxjs';

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

  public MonitorActiveMessage(): Observable<{ [uavNumber: string]: { [partition: number]: number } }> {
    return new Observable<{ [uavNumber: string]: { [partition: number]: number } }>((observer) => {
      this.connection.on('UpdateMessageCounts', (data: { [uavNumber: string]: { [partition: number]: number } }) => {
          observer.next(data);
      });
    });
  }
  
}
