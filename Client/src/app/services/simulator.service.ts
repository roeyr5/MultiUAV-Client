import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { channeldto } from '../models/channeldto';
import { path } from 'd3';

@Injectable({
  providedIn: 'root',
})
export class SimulatorService {
  private readonly ROOT_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  public simulatorPrimaryUavs(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(`${this.ROOT_URL}/simulator/PrimaryCommunications`);
  }
  public simulatorTimes(): Observable<{ [key: number]: number }> {
    return this.http.get<{ [key: number]: number }>(`${this.ROOT_URL}/simulator/TimeCommunications`);
  }
    public changePrimary(uavNumber: string): Observable<any> {
    return this.http.post( `${this.ROOT_URL}/simulator/ChangePrimaryCommunications`, { uavNumber: uavNumber });
  }
  public startSimulate(dto: channeldto): Observable<any> {
    return this.http.post(`${this.ROOT_URL}/simulator/StartIcd`, dto);
  }
  public updateSimulating(uavNumber : number,time:number) : Observable<any>{
    return this.http.post(`${this.ROOT_URL}/simulator/ChangeSimulateTime`, {uavNumber : uavNumber , time : time});
  }

  public telemetryUavs(): Observable<Map<number, channeldto[]>> {
    return this.http.get<Map<number, channeldto[]>>(`${this.ROOT_URL}/simulator/GetChannels`);
  }
  public pauseTelemetry(port: number, address: string): Observable<any> {
    return this.http.post(`${this.ROOT_URL}/simulator/Pause`, {
      port: port,
      address: address,
    });
  }
  public continueListening(port: number, address: string): Observable<any> {
    return this.http.post(`${this.ROOT_URL}/simulator/Continue`, {
      port: port,
      address: address,
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
}
