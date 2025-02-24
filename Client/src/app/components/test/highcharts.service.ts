import * as Highcharts from 'highcharts';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HighchartsService {
    constructor() {}

    createChart(el: HTMLElement, cfg: Highcharts.Options): void {
        Highcharts.chart(el, cfg);
    }
}
