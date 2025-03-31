import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ParameterDataDto } from '../entities/models/parameterDataDto';
// import { MessageIF } from '../models/message.model';
import { createPresetDto,PresetItem } from '../entities/models/presetItem';

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
    return this.http.get<string[]>(`${this.ROOT_URL}/parameters/all`);
  }
  public signup(email: string , password: string): Observable<any> {
    console.log("karni : " ,password , email);
    return this.http.post(`${this.ROOT_URL}/users/create`,{email : email , password : password});
  }
  public uavslist() :Observable<string[]>{
    return this.http.get<string[]>(`${this.ROOT_URL}/parameters/uavs`);
  }
  public uavsNumberslist() :Observable<string[]>{
    return this.http.get<string[]>(`${this.ROOT_URL}/parameters/uavslist`);
  }
  public getAllParameters(): Observable<{ [key: string]: ParameterDataDto[] }> {
    return this.http.get<{ [key: string]: ParameterDataDto[] }>(
      `${this.ROOT_URL}/parameters/all`
    );
  }


  public getUserPresets(email : string): Observable<PresetItem[]> {
    return this.http.get<PresetItem[]>(`${this.ROOT_URL}/presets/all`,{params : {email}});
  }
  public createOrSavePreset(presetItem : createPresetDto): Observable<any> {
    return this.http.post<createPresetDto>(`${this.ROOT_URL}/presets/createpreset`,presetItem);
  }
  

}
