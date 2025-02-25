export enum ChartType {
  Gauge = 'gauge',
  Graph = 'graph',
  Pie = 'pie',
}

export enum gaugeChartTypes {
  regular = 'regular-guage',
  pointer = "pointer-gauge"
}

export enum graphChartTypes {
  regular = 'regular-graph',
}

export enum pieChartTypes {
  regular = 'regular-pie',
}

export const ChartSubTypes:
Record<ChartType, any> = {
[ChartType.Gauge]:  gaugeChartTypes,
[ChartType.Graph]:  graphChartTypes,
[ChartType.Pie]:  pieChartTypes
}

export type ChartSubTypes = gaugeChartTypes | graphChartTypes | pieChartTypes;
