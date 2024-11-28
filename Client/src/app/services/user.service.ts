import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { MessageIF } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly ROOT_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) {}

  public login(email: string , password: string): Observable<any> {
    console.log("karni : " ,password , email);
    return this.http.post(`${this.ROOT_URL}/users/login`,{email : email , password : password});
  } 
  public list() : Observable<string[]> {
    return this.http.get<string[]>(`${this.ROOT_URL}/parameters/all`)
  }
  
  
}
