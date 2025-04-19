import { IcdParameter } from "./IcdParameter";

export interface ArchiveRequestDto {
  StartDate: Date;
  EndDate: Date;
  UavNumbers: number[];
  Communication: string;
  PageNumber: number;
  PageSize: number;
}

export interface ArchiveData{
  uavData: { [key: string]: string };
  dateTime: Date;
}

export interface ArchiveDataDto{
  archiveDataPackets:ArchiveData[];
  uavNumber:string;
  communication:string;
}

export interface ArchiveParameter {
  uavName:string;
  paramaeterName:string;
  dataArchive:ParamaterData[];
}

export interface ParamaterData{
  dateTime :Date;
  parameterValue :string; 
}