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
export class GraphArchiveComponent implements OnInit, AfterViewInit, OnChanges {
  private _chartEntities?: IChartEntity[];
  private _chartEntity?: IChartEntity;

  @Input()
  set chartEntities(value: IChartEntity[] | undefined) {
    this._chartEntities = value;
    if (value && value.length > 0) {
      this.loadLastMinuteData();
    }
  }
  get chartEntities(): IChartEntity[] | undefined {
    return this._chartEntities;
  }

  @Input()
  set chartEntity(value: IChartEntity | undefined) {
    this._chartEntity = value;
    if (value) {
      this.loadLastMinuteData();
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

  ngOnChanges(changes: SimpleChanges): void {}

  public loadLastMinuteData(): void {
    console.log(
      '[1] Load triggered, chartEntities:',
      this.chartEntities,
      'chartEntity:',
      this.chartEntity
    );

    const pageSize = 100;
    const pageNumber = 1;

    const nowUtc = Date.now();
    const israelOffsetMs = 3 * 60 * 60 * 1000;
    const now = new Date(nowUtc + israelOffsetMs);
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);

    if (this.chartEntities && this.chartEntities.length > 0) {
      console.log('[3] Handling multiple entities case');

      const req: ArchiveManyRequestDto = {
        StartDate: new Date('2025-04-28T12:00:00.000Z'),
        EndDate: now,
        UavNumbers: this.chartEntities.map((e) => e.parameter.uavNumber),
        Communication: this.chartEntities[0].parameter.communication,
        PageNumber: pageNumber,
        PageSize: pageSize,
        ParameterNames: this.chartEntities.map(
          (e) => e.parameter.parameterName
        ),
      };

      console.log('[4] Sending multi-entity request:', req);

      this._archiveService.getMultiArchiveData(req).subscribe({
        next: (result) => {
          console.log('[5] Multi-entity response:', result);
          console.log('[6] Raw packets:', result.archiveDataPackets);

          this.graphValues = this.chartEntities!.map((entity) => {
            const converted = this.convertApiPacketsToArchiveData(
              result.archiveDataPackets,
              entity.parameter.parameterName
            );
            console.log(
              `[7] Processed data for ${entity.parameter.parameterName}:`,
              converted
            );
            return {
              name: entity.parameter.parameterName,
              series: converted,
            };
          });

          console.log('[8] Final graphValues:', this.graphValues);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Request failed:', err);
        },
        complete: () => {
          console.log('Request complete.');
        },
      });
    } else if (this.chartEntity) {
      console.log('[10] Handling single entity case');


      const req: ArchiveManyRequestDto = {
        StartDate: new Date('2025-04-28T12:00:00.000Z'),
        EndDate: now,
        UavNumbers: [this.chartEntity.parameter.uavNumber],
        Communication: this.chartEntity.parameter.communication,
        PageNumber: pageNumber,
        PageSize: 10,
        ParameterNames: [this.chartEntity.parameter.parameterName],
      };

      console.log('[11] Sending single-entity request:', req);

      this._archiveService.getMultiArchiveData(req).subscribe({
        next: (result) => {
        console.log('[12] Single-entity response:', result);

        const responseData = Array.isArray(result) ? result[0] : result;
        const rawPackets = responseData?.archiveDataPackets || [];  

        const paramName = this.chartEntity!.parameter.parameterName;
        const converted = this.convertApiPacketsToArchiveData(
          rawPackets,
          paramName
        );
        
        console.log('[14] Processed data:', converted);
        
        this.graphValues = [{
          name: paramName,
          series: converted
        }];
        
        console.log('[15] Final graphValues:', this.graphValues);
        this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Request failed:', err);
        },
        complete: () => {
          console.log('Request complete.');
        },
      });
    }
  }

  private convertApiPacketsToArchiveData(
    packets: any[],
    parameterName: string
  ): GraphValue[] {
    const filtered = packets.filter(p => 
      p.parameters && p.parameters[parameterName] !== undefined
    );
    
    console.log(`[17] Filtered ${filtered.length}/${packets.length} packets for ${parameterName}`);
    
    return filtered.map((p) => {
      const numericValue = +p.parameters[parameterName]; // Convert to number
      if (isNaN(numericValue)) {
        console.warn(`[18] Invalid number value for ${parameterName}:`, p.parameters[parameterName]);
      }
      return {
        name: new Date(p.dateTime),
        value: numericValue.toString()
      };
    });
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
