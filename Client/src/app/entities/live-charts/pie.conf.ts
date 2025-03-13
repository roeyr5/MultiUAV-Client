import { Color, ScaleType } from '@swimlane/ngx-charts';

export class IPieConf
{
  defaultRecordsCount: number = 20;
  gradient: boolean = true;
  isLegend: boolean = false;
  isLabels: boolean = true;
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#00ff88', '#ffd700', '#00ffff'],
  };
  constructor() {

  }
}

export interface PieRecord {
  name: string;
  value: number;
}

export interface PieValue {
  name: Date;
  value: string;
}
