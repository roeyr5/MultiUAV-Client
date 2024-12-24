import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { MessageIF } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class LtsService {
  private readonly ROOT_URL = 'http://localhost:2000';
  constructor(private http: HttpClient) {}

  // public AddParameter(parameter: string ): Observable<any> {
  //   console.log("karni : " , parameter);
  //   return this.http.post(`${this.ROOT_URL}/AddParameter`,{parameter : parameter});
  // } 
  
  // public RemoveParameter(parameter: string ): Observable<any> {
  //   console.log("karni : " , parameter);
  //   return this.http.post(`${this.ROOT_URL}/RemoveParameter`,{parameter : parameter});
  // } 
}
