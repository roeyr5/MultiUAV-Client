import { Component, ElementRef,ChangeDetectorRef, Input,NgZone, ViewChild } from '@angular/core';
import { IChartEntity } from 'src/app/entities/models/IChartEntity';

@Component({
  selector: 'app-live-label',
  templateUrl: './live-label.component.html',
  styleUrls: ['./live-label.component.css']
})
export class LiveLabelComponent {

  @Input() chartEntity!:IChartEntity;

  public value:string ='N/A';
  private severityColor:string = "#3d388a";

  @ViewChild('labelContainer', { static: false }) labelContainer!: ElementRef<HTMLElement>;

  constructor(private cdr: ChangeDetectorRef, private ngZone: NgZone) {}
  
  ngOnInit(){
    // this.chartEntity.dataEvent.subscribe((value : any)=>{
    //   this.ngZone.run(()=>{
    //     this.value = value.toString();
    //     this.cdr.markForCheck();
    //   })
    // })

    this.chartEntity.dataEvent.subscribe((value) => {
      if ((value.trim() === "")) return;
      this.value = value;
    });
  }

  
  
  
}
