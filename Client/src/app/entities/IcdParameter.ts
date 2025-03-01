export class IcdParameter {
  parameterName: string;
  communication: string;
  uavNumber: number;
  units :string

  constructor(parameterName: string, communication: string, uavNumber: number , units :string) {
    this.parameterName = parameterName;
    this.communication = communication;
    this.uavNumber = uavNumber; 
    this.units = units;
  }
}