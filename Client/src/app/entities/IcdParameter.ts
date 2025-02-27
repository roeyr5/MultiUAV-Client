export class IcdParameter {
  parameterName: string;
  communication: string;
  uavNumber: number;

  constructor(parameterName: string, communication: string, uavNumber: number) {
    this.parameterName = parameterName;
    this.communication = communication;
    this.uavNumber = uavNumber; 
  }
}