import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Observable, partition } from 'rxjs';

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

  public joinGroup(uavName: string): Observable<void> {
    console.log(uavName);
    return new Observable<void>((observer) => {
      this.hubConnection.invoke('JoinGroup', uavName)
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

  public receiveMessage(): Observable<{ message : Map<string,string> , partition : number}> {
    return new Observable((observer) => {
      this.hubConnection.on('ReceiveMessage', (message: Map<string,string> , partition : number) => {
        console.log(partition);
        console.log(message);
        observer.next({message,partition});
      });
    });
  }

  public sendMessage(message: string): void {
    this.hubConnection.invoke('SendMessage', message);
  }

  public addParameter(parameter: string): void {
    this.hubConnection.invoke('AddParameter', parameter);
  }

  // Method to remove parameter
  public removeParameter(parameter: string): void {
    this.hubConnection.invoke('RemoveParameter', parameter);
  }
}
