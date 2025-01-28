import { GridsterItem } from "angular-gridster2";
import { Chart } from "chart.js";
import { ChartType } from "chart.js";

export interface ChartGridsterItem extends GridsterItem {
  chartType: ChartType;
  chartLabels: string[];
  communication: string;
  parameter: string;
  datasets: Array<{
    uavName: string;
    data: number[];
    label: string;
    color: string;
  }>;
  chartInstance?: Chart;

}
