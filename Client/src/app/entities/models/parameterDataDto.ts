export class ParameterDataDto {
  Identifier: string = '';
  Units: string = '';
  InterfaceLimitMin: number = 0;
  InterfaceLimitMax: number = 0;

 constructor(id: string,units: string,InterfaceLimitMin: number,InterfaceLimitMax: number ) {
    this.Identifier = id;
    this.Units = units;
    this.InterfaceLimitMin = InterfaceLimitMin;
    this.InterfaceLimitMax = InterfaceLimitMax;
  }}

