import { GridsterItem } from "angular-gridster2";

export interface basicData {
  labels: Array<string>;
  datasets: {
    label: string;
    data: number[];
  };
}