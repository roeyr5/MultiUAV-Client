import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, Observer, partition } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MonitorRService {
  private connection : signalR.HubConnection;
  private retryTimeout = 2000;
  private timeoutPromise = (ms: number) => new Promise((_, reject) => setTimeout(() => reject('Timeout'), ms));

  constructor() {
    this.connection = new signalR.HubConnectionBuilder().withUrl('http://localhost:9000/monitorhub').build();
  }

  
  startConnection(): Observable<void> {
      return new Observable((observer) => {
        this.connection = new signalR.HubConnectionBuilder()
          .withUrl('http://localhost:9000/monitorhub')
          .build();
  
        const startFn = () => {
          Promise.race([
            this.connection.start(),
            this.timeoutPromise(this.retryTimeout)
          ])
            .then(() => {
              observer.next();
              observer.complete();
            })
            .catch((err) => {
              observer.error(err);
              setTimeout(startFn, this.retryTimeout);
            });
        };
  
        startFn();
  
        this.connection.onclose((error) => {
          if (error) {
            console.error('Connection closed with error:', error);
          }
          setTimeout(() => startFn(), this.retryTimeout);
        });
      });
    }

  public MonitorActiveMessage(): Observable<{ [uavNumber: number]: { [partition: number]: number } }> {
    return new Observable<{ [uavNumber: number]: { [partition: number]: number } }>((observer) => {
      this.connection.on('UpdateMessageCounts', (data: { [uavNumber: number]: { [partition: number]: number } }) => {
          observer.next(data);
      });
    });
  }
  
}
