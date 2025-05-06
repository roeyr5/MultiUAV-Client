import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, partition } from 'rxjs';
import { IcdParameter } from '../entities/IcdParameter';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  private retryTimeout = 2000;
  private timeoutPromise = (ms: number) => new Promise((_, reject) => setTimeout(() => reject('Timeout'), ms));


  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl('http://localhost:2000/ltshub').build();
  }

  startConnection(): Observable<void> {
    return new Observable((observer) => {
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:2000/ltshub')
        .build();

      const startFn = () => {
        Promise.race([
          this.hubConnection.start(),
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

      this.hubConnection.onclose((error) => {
        if (error) {
          console.error('Connection closed with error:', error);
        }
        setTimeout(() => startFn(), this.retryTimeout);
      });
    });
  }

  public joinGroup(fulluavName: string ): Observable<void> {
    return new Observable<void>((observer) => {
      // console.log(fulluavName)
      this.hubConnection.invoke('JoinGroup', fulluavName)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.error('Error joining group:', error);
          observer.error(error);
        });
    });
  }

  public leaveGroup(uavName: string): Observable<void> {
    return new Observable<void>((observer) => {
      this.hubConnection.invoke('LeaveGroup', uavName)
        .then(() => {
          console.log(`Left group: ${uavName}`);
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          console.error('Error leaving group:', error);
          observer.error(error);
        });
    });
  }

  public receiveMessage(): Observable<{ message: { [key: string]: string }, uavName: string }> {
    return new Observable((observer) => {
      this.hubConnection.on('ReceiveMessage', (message:{ [key: string]: string }, uavName: string) => {
        observer.next({ message, uavName });
      });
    });
  }

  public sendMessage(message: string): void {
    this.hubConnection.invoke('SendMessage', message);
  }

  public addParameter(parameter:IcdParameter): void {
    this.hubConnection.invoke('AddParameter', parameter.uavNumber+parameter.communication, parameter.parameterName)
      .then(() => {
        // console.log(`Parameter added: ${parameter.parameterName} for UAV: ${parameter.uavNumber}`);
      })
      .catch((error) => {
        console.error('Error adding parameter:', error);
      });
  }

  public removeParameter(parameter:IcdParameter): void {
    this.hubConnection.invoke('RemoveParameter', parameter.uavNumber+parameter.communication, parameter.parameterName)
      .then(() => {
        console.log(`Parameter removed: ${parameter.parameterName} for UAV: ${parameter.uavNumber}`);
      })
      .catch((error) => {
        console.error('Error removing parameter:', error);
      });
  }
  
}
