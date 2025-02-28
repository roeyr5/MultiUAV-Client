import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, partition } from 'rxjs';
import { IcdParameter } from '../entities/IcdParameter';

@Injectable({
  providedIn: 'root',
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder().withUrl('http://localhost:2000/ltshub').build();
  }

  public startConnection(): Observable<void> {
    return new Observable<void>((observer) => {
      this.hubConnection
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

  public joinGroup(fulluavName: string ): Observable<void> {
    return new Observable<void>((observer) => {
      console.log(fulluavName)
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

  public receiveMessage(): Observable<{ message: Array<{ parameterName: string, parameterValue: string }>; uavName: string }> {
    return new Observable((observer) => {
      this.hubConnection.on('ReceiveMessage', (message: Array<{ parameterName: string, parameterValue: string }>, uavName: string) => {
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
        console.log(`Parameter added: ${parameter.parameterName} for UAV: ${parameter.uavNumber}`);
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
