import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { channeldto } from '../models/channeldto';
import { path } from 'd3';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {
  private readonly ROOT_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}
  

  public SimulatorPrimaryUavs() :Observable<{[key: string]: string}> {
    return this.http.get<{[key: string]: string}>(`${this.ROOT_URL}/simulator/PrimaryCommunications`);
  }
  public ChangePrimary(uavNumber : string) :Observable<any> {
    return this.http.post(`${this.ROOT_URL}/simulator/ChangePrimaryCommunications`,{uavNumber : uavNumber});
  }
  public StartSimulate(dto : channeldto) : Observable<any>{
    return this.http.post(`${this.ROOT_URL}/simulator/StartIcd`,dto);
  }


  public TelemetryUavs() :Observable<channeldto[]>{
    return this.http.get<channeldto[]>(`${this.ROOT_URL}/simulator/GetChannels`);
  }
  public pauseTelemetry(port:number,address:string ) : Observable<any> {
    return this.http.post(`${this.ROOT_URL}/simulator/Pause`,{port: port,address:address});
  }
  public continueListening(port:number,address:string) : Observable<any>{
    return this.http.post(`${this.ROOT_URL}/simulator/Continue`,{port: port,address:address});
  }
  public deleteChannel(port:number,address:string) : Observable<any>{
    return this.http.post(`${this.ROOT_URL}/simulator/Stop`,{port: port,address:address});
  }


  public startPcap(filepath:string , uavNumber:number,channel:string,type:string) : Observable<any> {
    return this.http.post(`${this.ROOT_URL}/simulator/StartPcap`,{filename:filepath , uavNumber : uavNumber , channel : channel , type : type});
  }
}

