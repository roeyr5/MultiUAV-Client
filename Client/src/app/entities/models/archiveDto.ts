import { IcdParameter } from "./IcdParameter";

export interface ArchiveManyRequestDto { //many Paramters
  StartDate: Date;
  EndDate: Date;
  UavNumbers: number[];
  Communication: string;
  PageNumber: number;
  PageSize: number;
  ParameterNames:string[];
}

export interface ArchiveSingleRequestDto { // single Parameter
  StartDate: Date;
  EndDate: Date;
  UavNumbers: number[];
  Communication: string;
  PageNumber: number;
  PageSize: number;
  ParameterName:string;
}

export interface ArchiveParameterData{
  uavNumber:string;
  value: string;
  dateTime: Date;
}

export interface ArchiveDataDto{
  archiveDataPackets:ArchiveParameterData[];
  uavNumber:string;
  communication:string;
  parameterName:string;
}

export interface ArchiveParameter {
  uavName:string;
  paramaeterName:string;
  communication:string;
  dataArchive:ArchiveParameterData[];
}
