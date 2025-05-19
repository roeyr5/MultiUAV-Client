import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { channeldto } from '../entities/models/channeldto';
import { path } from 'd3';

export interface simulatorDto {
  uavNumber: number;
  channelType: string;
}


@Injectable({
  providedIn: 'root',
})
export class SimulatorService {
  constructor(private http: HttpClient) {}
  private readonly ROOT_URL = 'http://localhost:3000';

  public simulatorPrimaryUavs(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(
      `${this.ROOT_URL}/simulator/PrimaryCommunications`
    );
  }
  public simulatorTimes(): Observable<{ [key: number]: number }> {
    return this.http.get<{ [key: number]: number }>(
      `${this.ROOT_URL}/simulator/TimeCommunications`
    );
  }
  public changePrimary(uavNumber: number): Observable<any> {
    return this.http.post(
      `${this.ROOT_URL}/simulator/ChangePrimaryCommunications`,
      { uavNumber: uavNumber }
    );
  }
  public startSimulate(dto: channeldto): Observable<any> {
    console.log(dto);
    
    return this.http.post(`${this.ROOT_URL}/simulator/StartIcd`, dto);
  }
  public updateSimulating(uavNumber: number, time: number): Observable<any> {
    return this.http.post(`${this.ROOT_URL}/simulator/ChangeSimulateTime`, {
      uavNumber: uavNumber,
      time: time,
    });
  }

  public telemetryUavs(): Observable<Map<number, channeldto[]>> {
    return this.http.get<Map<number, channeldto[]>>(
      `${this.ROOT_URL}/simulator/GetChannels`
    );
  }

  public pauseTelemetry(uavNumber: number, channelType: string): Observable<any> {
    return this.http.post(`${this.ROOT_URL}/simulator/Stop`, {
      uavNumber: uavNumber,
      channelType: channelType,
    });
  }
  public continueListening(uavNumber: number, channelType: string): Observable<any> {
    return this.http.post(`${this.ROOT_URL}/simulator/Continue`, {
      uavNumber: uavNumber,
      channelType: channelType,
    });
  }

  public deleteChannel(
    port: number,
    address: string,
    pcap: boolean
  ): Observable<any> {
    return this.http.post(`${this.ROOT_URL}/simulator/Stop`, {
      port: port,
      address: address,
      pcap: pcap,
    });
  }

  public startPcap(filepath: string, uavNumber: number): Observable<any> {
    return this.http.post(`${this.ROOT_URL}/simulator/StartPcap`, {
      filename: filepath,
      uavNumber: uavNumber,
    });
  }
  
  public getActiveUavs(): Observable<number[]> {
    return this.http.get<number[]>(`http://localhost:7000/Simulator/GetAllTailNumbers`);
  }
}
