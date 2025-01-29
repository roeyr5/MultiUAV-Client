import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimulatorService {
  private readonly ROOT_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}


  // public login(email: string , password: string): Observable<any> {
  //   console.log("karni : " ,password , email);
  //   return this.http.post(`${this.ROOT_URL}/users/login`,{email : email , password : password});
  // } 
  // public list() : Observable<string[]> {
  //   return this.http.get<string[]>(`${this.ROOT_URL}/parameters/all`);
  // }
  // public signup(email: string , password: string): Observable<any> {
  //   console.log("karni : " ,password , email);
  //   return this.http.post(`${this.ROOT_URL}/users/create`,{email : email , password : password});
  // }
  // public uavslist() :Observable<string[]>{
  //   return this.http.get<string[]>(`${this.ROOT_URL}/parameters/uavs`);
  
  public PrimaryUavs() :Observable<{[key: string]: string}> {
    return this.http.get<{[key: string]: string}>(`${this.ROOT_URL}/simulator/PrimaryCommunications`);
  }

  public ChangePrimary(uavNumber : string) :Observable<any> {
    return this.http.post(`${this.ROOT_URL}/simulator/ChangePrimaryCommunications`,{uavNumber : uavNumber});
  }
}

