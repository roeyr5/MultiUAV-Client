export class IcdParameter {
  parameterName: string;
  communication: string;
  uavNumber: number;
  units :string
  InterfaceLimitMin: number;
  InterfaceLimitMax: number;

  constructor(parameterName: string, communication: string, uavNumber: number , units :string, InterfaceLimitMin: number, InterfaceLimitMax: number) 
  {
    this.parameterName = parameterName;
    this.communication = communication;
    this.uavNumber = uavNumber; 
    this.units = units;
    this.InterfaceLimitMin = InterfaceLimitMin;
    this.InterfaceLimitMax = InterfaceLimitMax;
  }
}