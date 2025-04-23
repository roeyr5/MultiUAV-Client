import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ArchiveParameterData, ArchiveParameter } from 'src/app/entities/models/archiveDto'; 
import { MatTableModule } from '@angular/material/table'; 

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
  @Input() public data: ArchiveParameter[] = [];

  columns: string[] = ['uavName', 'datetime', 'value'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  uavNames: string[] = [];
  displayedColumns: string[] = ['dateTime'];


  ngOnInit() {
    console.log(this.data.length);
    
    if (this.data.length > 0) {
      this.columns = Object.keys(this.data[0]);
      this.dataSource = new MatTableDataSource(this.data);
    }
    this.formatTableData();

  }
  formatTableData() {
    this.uavNames = this.data.map(dataa => dataa.uavName);
    this.displayedColumns = ['dateTime', ...this.uavNames];

    const allDates = new Set<string>();
    this.data.forEach(uav => {
      uav.dataArchive.forEach(entry => {
        allDates.add(entry.dateTime.toString());
      });
    });

    const sortedDates = Array.from(allDates).sort();

     const rows: FormattedRow[] = sortedDates.map(date => {
      const row: FormattedRow = { dateTime: this.formatDate(date) };
      
      this.uavNames.forEach(uavName => {
        const uavData = this.data.find(dataa => dataa.uavName === uavName);
        const entry = uavData?.dataArchive.find(entry => entry.dateTime.toString() === date);
        row[uavName] = entry ? entry.value : ''; 
      });
      
      return row;
    });

    this.dataSource.data = rows;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}
