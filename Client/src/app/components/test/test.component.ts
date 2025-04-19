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


@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatNativeDateModule, MatPaginatorModule, MatSelectModule, MatSidenavModule, MatExpansionModule, MatCheckboxModule, MatIconModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  
})
export class TestComponent {
  
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