import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnInit,
  NgZone,
  ChangeDetectorRef,
} from '@angular/core';
import { IGaugeConf } from 'src/app/entities/live-charts/gauge.conf';
import { ChartGridsterItem } from 'src/app/entities/models/chartitem';
import {
  IChartEntity,
  IGridsterParameter,
} from 'src/app/entities/models/IChartEntity';

@Component({
  selector: 'app-gauge-chart',
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.css'],
})
export class GaugeChartComponent implements OnInit {
  @Input() chartEntity!: IChartEntity;
  public gaugeConf: IGaugeConf = new IGaugeConf();

  public gaugeValue: number = 0;
  public size: number = 120;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}

  ngOnInit(): void {
    setTimeout(() => {
      //@ts-ignore Cannot find name 'ResizeObserver'
      const resizeObserver = new ResizeObserver((entries) => {
        this.ngZone.run(() => {
          this.resizeGauge();
          this.cdr.markForCheck();
        });
      });
      resizeObserver.observe(
        document.getElementById(this.chartEntity.id.toString())!
      );
    }, 20);

    this.chartEntity.dataEvent.subscribe((value) => {
      this.gaugeValue = Number(value);
    });
  }

  public gaugeConfig(): IGaugeConf {
    return this.gaugeConf;
  }

  public resizeGauge(): void {
    console.log('asdasdasdasd');

    let parent = document.getElementById(this.chartEntity.id);
    if (parent) {
      let parentWidth: number = +parent.offsetWidth;
      let parentHeight: number = +parent.offsetHeight;
      this.size =
        parentHeight < parentWidth ? parentHeight : 0.95 * parentWidth;
      console.log('this.size', this.size);
    }
  }
}
