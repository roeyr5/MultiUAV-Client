import { Component , OnInit } from '@angular/core';
import { LtsService } from 'src/app/services/lts.service';
import { SignalRService } from 'src/app/services/signalr.service';
import { UserService } from 'src/app/services/user.service';
import { DisplayGrid, GridsterConfig, GridsterItem,GridType }  from 'angular-gridster2';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  
  protected options: GridsterConfig ={};
  protected dashboard: Array<GridsterItem> =[];

  protected items: Map<number,Map<string,string>> = new Map<number,Map<string,string>> ();
  protected selectedValue : string = '';
  public receivedmessage:string = '';
  protected parametersarray:string[]=[];
  
  constructor(private signalRService : SignalRService , private userservice:UserService , private ltsservice:LtsService){}

  public ngOnInit(): void {
      this.StartConnection();
      this.GetParameters();
      this.InitGridsterOptions();
  }

  private InitGridsterOptions(): void {
    this.options = {
      gridType: GridType.Fit, // Other options: 'ScrollVertical', 'ScrollHorizontal', 'Fixed'
      compactType: 'none', // Options: 'compactUp', 'compactLeft', 'none'
      margin: 10,
      outerMargin: true,
      outerMarginTop: null,
      outerMarginRight: null,
      outerMarginBottom: null,
      outerMarginLeft: null,
      useTransformPositioning: true,
      mobileBreakpoint: 640,
      minCols: 1,
      maxCols: 10,
      minRows: 1,
      maxRows: 10,
      maxItemCols: 5,
      minItemCols: 1,
      maxItemRows: 5,
      minItemRows: 1,
      maxItemArea: 25,
      minItemArea: 1,
      defaultItemCols: 2,
      defaultItemRows: 2,
      fixedColWidth: 105,
      fixedRowHeight: 105,
      keepFixedHeightInMobile: false,
      keepFixedWidthInMobile: false,
      scrollSensitivity: 10,
      scrollSpeed: 20,
      enableEmptyCellClick: false,
      enableEmptyCellContextMenu: false,
      enableEmptyCellDrop: false,
      enableEmptyCellDrag: false,
      emptyCellDragMaxCols: 50,
      emptyCellDragMaxRows: 50,
      ignoreMarginInRow: false,
      draggable: {
        enabled: false,
      },
      resizable: {
        enabled: false,
      },
      swap: false,
      pushItems: true,
      disablePushOnDrag: false,
      disablePushOnResize: false,
      disableAutoPositionOnConflict: false,
      api: {},
      displayGrid: DisplayGrid.Always, // Options: 'Always', 'OnDrag&Resize', 'None'
      disableWindowResize: false,
      disableWarnings: false,
      scrollToNewItems: false,
    };

    this.dashboard = [
      { cols: 2, rows: 1, y: 0, x: 0 },
      { cols: 2, rows: 2, y: 0, x: 2 },
      { cols: 1, rows: 1, y: 2, x: 0 },
      { cols: 1, rows: 1, y: 2, x: 1 },
      { cols: 2, rows: 1, y: 2, x: 2 },
    ];
  }

  private ChangedOptions() {
    if (this.options.api && this.options.api.optionsChanged) {
      this.options.api.optionsChanged();
    }
  }
  public MoveParameters(){
    this.options.draggable ={enabled : true};
    this.options.resizable = {enabled : true};
    this.ChangedOptions();
  }
  
  private StartConnection(){
    this.signalRService.startConnection().subscribe((response)=>{
      console.log("worked signalR");

      this.signalRService.receiveMessage().subscribe((message)=>{
        this.items.set(message.partition,message.message);
        console.log(message);
      });
    });
  }

  protected sendMessage(message: string): void {
    this.signalRService.sendMessage(message);
    console.log(message);

  }

  protected GetParameters(){    
    this.userservice.list().subscribe((res)=>{
      this.parametersarray=res;
    },(err) =>{
      console.error("error" , err);
    }
    )
  }

  protected onSelect(event: any): void {
    const selectedValue = event.value;

    
    this.dashboard.push({
      cols: 1, 
      rows: 1, 
      y: 0, 
      x: this.dashboard.length 
    });

    this.signalRService.addParameter(selectedValue); 
  }

  protected onRemove(event: any): void {
    const selectedValue = event.value;
    this.signalRService.removeParameter(selectedValue);  
  }
  
}
