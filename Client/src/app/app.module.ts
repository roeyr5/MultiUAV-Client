// src/app/app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './components/Login_Register/signin/signin.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { GridsterModule } from 'angular-gridster2';
import { LiveComponent } from './components/Live_View/live/live.component';
import { MonitorComponent } from './components/Live_View/monitor/monitor.component';
import { SignupComponent } from './components/Login_Register/signup/signup.component';
import { ConfigComponent } from './components/Live_View/config/config.component';
import { TestComponent } from './components/test/test.component';
import { AddNewDialogComponent } from './components/Other_Logic/dialogs/add-new-dialog.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from './components/Other_Logic/sidebar/sidebar.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChartComponent } from './components/Live_View/chart/chart.component';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { ImageModule } from 'primeng/image';
import { MatTableModule } from '@angular/material/table';
import { DropdownModule } from 'primeng/dropdown'; 
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { ChartModule } from 'angular-highcharts';
import { HighchartsService } from './components/test/highcharts.service';
import { SideBarParametersComponent } from './components/generic-components/side-bar-parameters/side-bar-parameters.component';
import { LiveDashboardComponent } from './components/Live_View/live/live-dashboard/live-dashboard.component';
import { GaugeChartComponent } from './components/generic-components/chart-entity/charts-types/gauge-chart/gauge-chart.component';
import { GraphChartComponent } from './components/generic-components/chart-entity/charts-types/graph-chart/graph-chart.component';
import { PieChartComponent } from './components/generic-components/chart-entity/charts-types/pie-chart/pie-chart.component';
import { MatMenuModule } from '@angular/material/menu';
import { GridsterBlockComponent } from './components/generic-components/chart-entity/charts-types/gridster-block/gridster-block.component';
import { StringDataComponent } from './components/generic-components/chart-entity/charts-types/string-data/string-data.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { LiveLabelComponent } from './components/generic-components/chart-entity/charts-types/live-label/live-label.component';
import { ConcatGraphComponent } from './components/generic-components/chart-entity/charts-types/concat-graph/concat-graph.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PresetParametersComponent } from './components/generic-components/preset-parameters/preset-parameters.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {MatNativeDateModule} from '@angular/material/core';
import { MatDatepickerInput } from '@angular/material/datepicker';
import {MatPaginatorModule} from '@angular/material/paginator';
import { ArchiveDataComponent } from './components/Other_Logic/archive-data/archive-data.component';
import { GenericTableComponent } from './components/generic-components/generic-table/generic-table.component';
import { MatSortModule } from '@angular/material/sort';
import { ArchiveParametersComponent } from './components/generic-components/archive-parameters/archive-parameters.component';  // For sorting (if you need sorting functionality)


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    LiveComponent,
    MonitorComponent,
    SignupComponent,
    AddNewDialogComponent,
    SidebarComponent,
    ChartComponent,
    SideBarParametersComponent,
    LiveDashboardComponent,
    GaugeChartComponent,
    GraphChartComponent,
    PieChartComponent,
    GridsterBlockComponent,
    StringDataComponent,
    LiveLabelComponent,
    ConcatGraphComponent,
    PresetParametersComponent,
  ],
  imports: [
    MatSortModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    NgxGaugeModule,
    MatTooltipModule,
    GridsterModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    ImageModule,
    RippleModule,
    MatMenuModule,
    ButtonModule,
    ToastModule,
    MatTableModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    DropdownModule,
    HighchartsChartModule,
    ChartModule,
    MatExpansionModule,
    MatExpansionModule,
    ConfigComponent,
    ArchiveDataComponent,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
