import { Color, ScaleType } from '@swimlane/ngx-charts';

export class IGraphConf {
  defaultRecordsCount: number = 20;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = false;
  showXAxisLabel: boolean = false;
  showYAxisLabel: boolean = true;
  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#f00', '#0f0', '#0ff'],
  };
  constructor() {}
}

export interface GraphRecordsList {
  name: string;
  series: GraphValue[];
}

export interface GraphValue {
  name: Date;
  value: string;
}
