export class IGaugeConf {
  duration: number;
  type: GaugeType;
  cap: GaugeCap;
  thick: GaugeThickness;
  label: string;
  isThreshold: string;
  foregroundColor: string;
  backgroundColor: string;

  constructor() {
    this.duration = 1000;
    this.type = GaugeType.FULL;
    this.cap = GaugeCap.ROUND;
    this.thick = GaugeThickness.MEDIUM;
    this.label = '';
    this.isThreshold = 'false';
    this.foregroundColor = '#000000';
    this.backgroundColor = '#ffffff';
  }
}

export enum GaugeType {
  FULL = 'full',
  SEMI = 'semi',
  ARCH = 'arch',
}

export enum GaugeCap {
  ROUND = 'round',
  FLAT = 'flat',
  BUTT = 'butt',
}

export enum GaugeThickness {
  THIN = 'thin',
  MEDIUM = 'medium',
  THICK = 'thick',
  VERY_THICK = 'very-thick',
}
