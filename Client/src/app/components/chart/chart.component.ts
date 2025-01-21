
import { Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartType , registerables} from 'chart.js';


@Component({
  selector: 'app-chart',
  template: `<canvas #chartCanvas></canvas>`,
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit, OnChanges {
  @Input() public chartType: ChartType = 'line'; 
  @Input() public chartData: number[] = [];
  @Input() public chartLabels: string[] = [];
  @Input() public parameterName: string = ''; 

  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;

  constructor() {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.createChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    let requiresUpdate = false;
  
    if (changes['chartData'] && !changes['chartData'].firstChange) {
      requiresUpdate = true;
    }
    if (changes['chartLabels'] && !changes['chartLabels'].firstChange) {
      requiresUpdate = true;
    }
    if (changes['chartType'] && !changes['chartType'].firstChange) {
      requiresUpdate = true;
    }
  
    if (requiresUpdate) {
      this.updateChart();
    }
  }

  private createChart(): void {
    const ctx = this.chartCanvas.nativeElement.getContext('2d'); 

    this.chart = new Chart(ctx!, {
      type: this.chartType,
      data: {
        labels: this.chartLabels, 
        datasets: [
          {
            label: `Parameter: ${this.parameterName}`,
            data: this.chartData,
            backgroundColor: 'black',
            borderColor: 'yellow',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true, 
      },
    });
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.destroy(); 
    }
    this.createChart(); 
  }
}
