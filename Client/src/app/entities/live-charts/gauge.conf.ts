export class IGaugeConf {
  thresholds?: { [key: number]: { color: string } };
  gradient?: { enabled: boolean; stops: [number, string][] };
  animate?: { enabled: boolean; duration: number };
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
    this.foregroundColor = '#00ff00';
    this.backgroundColor = 'rgba(255, 255, 255, 0.1)';
    this.thresholds = {
      0: { color: '#ff0000' },
      50: { color: '#ffd700' },
      75: { color: '#00ff00' }
    };
    this.animate = { enabled: true, duration: 1000 };
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
