import { Component, Input, OnInit } from '@angular/core';
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
export class GenericTableComponent implements OnInit {

  @Input() public parameterName: string = '';
  @Input() public dataEvent!: Observable<{param: string; data: ArchiveParameter[]}>;

  private dataSubscription!: Subscription;


  columns: string[] = ['uavName', 'datetime', 'value'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  uavNames: string[] = [];
  displayedColumns: string[] = ['dateTime'];


  ngOnInit() {
    this.dataSubscription = this.dataEvent.pipe(
      filter(event => event.param.endsWith(this.parameterName)) // Match parameter suffix
    ).subscribe(event => {
      this.formatTableData(event.data);
    });
  }

  private formatTableData(data: ArchiveParameter[]): void {
    // Extract unique UAV names
    this.uavNames = [...new Set(data.map(p => p.uavName))];
    this.displayedColumns = ['dateTime', ...this.uavNames];
  
    // Collect all unique timestamps
    const allDates = new Set<string>();
    data.forEach(uavParam => {
      uavParam.dataArchive.forEach(entry => {
        allDates.add(entry.dateTime.toISOString());
      });
    });
  
    // Create rows for each timestamp
    const rows: FormattedRow[] = Array.from(allDates).sort().map(isoDate => {
      const row: FormattedRow = {
        dateTime: this.formatDate(isoDate),
      };
  
      // Populate values for each UAV
      this.uavNames.forEach(uavName => {
        const uavData = data.find(p => p.uavName === uavName);
        row[uavName] = uavData?.dataArchive.find(d => 
          d.dateTime.toISOString() === isoDate
        )?.value || '';
      });
      console.log('Formatted rows:', rows);
  
      return row;
    });
  
    this.dataSource.data = rows;
  }
  private updateDisplayedColumns(): void {
    this.displayedColumns = ['dateTime', ...this.uavNames];
  }

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
