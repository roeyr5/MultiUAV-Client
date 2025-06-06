import { CommonModule } from '@angular/common';
import { Component, QueryList, ViewChildren } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon'
import { GraphRecordsList, GraphValue } from 'src/app/entities/live-charts/graph.conf';


@Component({
  selector: 'app-test-page',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  
})
export class TestComponent {

  mockData: GraphRecordsList[] = [];

  constructor() {
    this.mockData = this.generateMockGraph('Temperature Sensor');
  }

  generateMockGraph(name: string): GraphRecordsList[] {
    const start = new Date('2025-04-01T00:00:00');
    const series: GraphValue[] = [];

    for (let i = 0; i < 500; i++) {
      const time = new Date(start.getTime() + i * 60000); // every 1 minute
      const value = (20 + Math.sin(i / 50) * 5 + Math.random()).toFixed(1); // smooth + noise
      series.push({ name: time, value });
    }

    return [{ name, series }];
  }
  
  packetTypes = [
    { value: 0, label: 'Type 0' },
    { value: 2, label: 'Type 2' },
    { value: 23, label: 'Type 23' }
  ];
    public selectedParmateres: Map<string, boolean> = new Map<string, boolean>();
  public showFiller = false;
  public currentPacketCount = 0;
  private pageStart: number = 0;
  private pageEnd: number = 10;
  public range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    packetType: new FormControl(''), 
  });
 
  public isExporting: boolean = false;
  onPageChange(event: any) {
    this.pageStart = event.pageIndex * event.pageSize
    this.pageEnd = event.pageIndex * event.pageSize + event.pageSize
  }

  public onStartDateChange(event: any) {
    if (event.value == null)
      return
  }
  public onSidenavToggle() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }
  public onCheckboxChange(event: any): void {
    this.selectedParmateres.set(event.source.value, !this.selectedParmateres.get(event.source.value))
  }
} 