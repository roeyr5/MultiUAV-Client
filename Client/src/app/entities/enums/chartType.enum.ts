export enum ChartType {
  Gauge = 'solidgauge',
  Graph = 'spline',
  Pie = 'pie',
}
export enum SingleChart {
  GAUGE = 0,
  GRAPH = 1,
  PIE = 2,
  LABEL = 3,
}
export enum gaugeChartTypes {
  regular = 'regular-guage',
  pointer = 'pointer-gauge',
}

export enum graphChartTypes {
  regular = 'regular-graph',
}

export enum pieChartTypes {
  regular = 'regular-pie',
}

export const ChartSubTypes: Record<ChartType, any> = {
  [ChartType.Gauge]: gaugeChartTypes,
  [ChartType.Graph]: graphChartTypes,
  [ChartType.Pie]: pieChartTypes,
};

export type ChartSubTypes = gaugeChartTypes | graphChartTypes | pieChartTypes;
