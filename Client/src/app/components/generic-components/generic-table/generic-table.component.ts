import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ArchiveParameterData, ArchiveParameter } from 'src/app/entities/models/archiveDto'; 
import { MatTableModule } from '@angular/material/table'; 
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface FormattedRow {
  dateTime: string;
  [key: string]: string;
}
interface DataEntry {
  dateTime: Date;
  value: string;
}
@Component({
  selector: 'app-generic-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatIconModule
  ],
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.css']
})
export class GenericTableComponent implements OnChanges  {

  @Input() paramTables: { [param: string]: { [uav: string]: DataEntry[] } } = {};

  // Helper functions for template
  get parameters(): string[] {
    return Object.keys(this.paramTables);
  }

  getUAVs(param: string): string[] {
    return Object.keys(this.paramTables[param] || {});
  }

  getMaxEntries(param: string): number {
    const entries = Object.values(this.paramTables[param] || {});
    return entries.length ? Math.max(...entries.map(e => e.length)) : 0;
  }

  getIndexArray(length: number): number[] {
    return Array.from({length}, (_, i) => i);
  }

  ngOnChanges(changes: SimpleChanges) {
    // if (changes['paramTables']) {
    //   // console.log('Child received new data:', this.paramTables);
    //   this.logDataStructure();
    // }
  }

  // private logDataStructure() {
  //   this.parameters.forEach(param => {
  //   });
  // }


  // private formatTableData(data: ArchiveParameter[]): void {
  //   const allDates = new Set<string>();
  //   data.forEach(uav => {
  //     uav.dataArchive.forEach(entry => {
  //       allDates.add(entry.dateTime.toString());
  //     });
  //   });

  //   const sortedDates = Array.from(allDates).sort();
  //   const rows: FormattedRow[] = sortedDates.map(date => {
  //     const row: FormattedRow = { dateTime: this.formatDate(date) };
      
  //     data.forEach(uav => {
  //       const entry = uav.dataArchive.find(e => e.dateTime.toString() === date);
  //       row[uav.uavName] = entry ? entry.value : '';
  //     });
      
  //     return row;
  //   });

  //   this.dataSource.data = rows;
  // }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}
