import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ArchiveDataDto, ArchiveManyRequestDto, ArchiveSingleRequestDto } from '../entities/models/archiveDto';

@Injectable({
  providedIn: 'root'
})
export class ArchiveService {

  private readonly ROOT_URL = 'http://localhost:9900';

  constructor(private http: HttpClient) {}

  public getArchiveData(dto:ArchiveSingleRequestDto): Observable<ArchiveDataDto[]> {
    return this.http.post<ArchiveDataDto[]>(`${this.ROOT_URL}/archive/getArchiveData`,dto);
  }
  public getMultiArchiveData(archiveRequest:ArchiveManyRequestDto) :Observable<any>{
    console.log(archiveRequest);
    return this.http.post<any>(`${this.ROOT_URL}/archive/getMultiArchiveData` ,archiveRequest);
  }


  public getArchiveUavs(): Observable<number[]>{
    return this.http.get<number[]>(`${this.ROOT_URL}/archive/getalluavs`);
  }
 

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
  // }
  // public uavsNumberslist() :Observable<string[]>{
  //   return this.http.get<string[]>(`${this.ROOT_URL}/parameters/uavslist`);
  // }
  // public getAllParameters(): Observable<{ [key: string]: ParameterDataDto[] }> {
  //   return this.http.get<{ [key: string]: ParameterDataDto[] }>(`${this.ROOT_URL}/parameters/all`);
  // }


  // public getUserPresets(email : string): Observable<createPresetDto[]> {
  //   return this.http.get<createPresetDto[]>(`${this.ROOT_URL}/presets/all`,{params : {email}});
  // }
  // public createPreset(presetItem : createPresetDto): Observable<any> {
  //   return this.http.post<createPresetDto>(`${this.ROOT_URL}/presets/createpreset`,presetItem);
  // }
  // public updatePreset(presetItem : createPresetDto): Observable<any> {
  //   return this.http.post<createPresetDto>(`${this.ROOT_URL}/presets/updatepreset`,presetItem);
  // }
  // public deletePreset(presetItem: createPresetDto): Observable<any> {
  //   return this.http.put<createPresetDto>(`${this.ROOT_URL}/presets/deletepreset`, presetItem);
  // }

}
