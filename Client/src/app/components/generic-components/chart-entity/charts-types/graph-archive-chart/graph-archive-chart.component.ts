import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  GraphRecordsList,
  GraphValue,
  IGraphConf,
} from 'src/app/entities/live-charts/graph.conf';
import { ArchiveManyRequestDto } from 'src/app/entities/models/archiveDto';
import { IChartEntity } from 'src/app/entities/models/IChartEntity';
import { ArchiveService } from 'src/app/services/archive.service';

@Component({
  selector: 'app-graph-archive',
  templateUrl: './graph-archive-chart.component.html',
  styleUrls: ['./graph-archive-chart.component.css'],
})
export class GraphArchiveComponent implements OnInit, AfterViewInit {
  private _chartEntities?: IChartEntity[];
  private _chartEntity?: IChartEntity;
  private hasLoaded = false;

  @Input()
  set chartEntities(value: IChartEntity[] | undefined) {
    this._chartEntities = value;
    if (value && value.length > 0 && !this.hasLoaded) {
      this.hasLoaded = true;
      // this.loadLastMinuteData();
    }
  }
  get chartEntities(): IChartEntity[] | undefined {
    return this._chartEntities;
  }

  @Input()
  set chartEntity(value: IChartEntity | undefined) {
    this._chartEntity = value;
    if (value && !this.hasLoaded) {
      this.hasLoaded = true;
      // this.loadLastMinuteData();
    }
  }
  get chartEntity(): IChartEntity | undefined {
    return this._chartEntity;
  }
  title: string = 'Archived Graph';

  public view: [number, number] = [0, 0];
  public archiveData: GraphValue[] = [];
  public graphValues: GraphRecordsList[] = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private _archiveService: ArchiveService
  ) {}

  @ViewChild('graph', { static: false }) graph!: ElementRef;

  ngOnInit(): void {
    setTimeout(() => this.cdr.detectChanges(), 0);
    setTimeout(() => {
      const resizeObserver = new ResizeObserver(() => {
        this.ngZone.run(() => {
          this.updateGraphSize();
          this.cdr.markForCheck();
        });
      });
      resizeObserver.observe(this.graph?.nativeElement);
    }, 20);
  }

  ngAfterViewInit(): void {
    this.updateGraphSize();
  }


 

  updateGraphSize() {
    const element = this.graph?.nativeElement;
    if (element) {
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      if (this.view[0] !== width || this.view[1] !== height) {
        this.view = [width, height];
        this.cdr.detectChanges();
      }
    }
  }

  graphConfig(): IGraphConf {
    return new IGraphConf();
  }
}
