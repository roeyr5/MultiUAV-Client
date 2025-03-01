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
import { NgApexchartsModule } from 'ng-apexcharts';
import { DropdownModule } from 'primeng/dropdown'; 
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { ChartModule } from 'angular-highcharts';
import { HighchartsService } from './components/test/highcharts.service';
import { SideBarParametersComponent } from './components/generic-components/side-bar-parameters/side-bar-parameters.component';
import { LiveDashboardComponent } from './components/Live_View/live/live-dashboard/live-dashboard.component';
import { ChartEntityComponent } from './components/generic-components/chart-entity/chart-entity.component';
import { GaugeChartComponent } from './components/generic-components/chart-entity/charts-types/gauge-chart/gauge-chart.component';
import { GraphChartComponent } from './components/generic-components/chart-entity/charts-types/graph-chart/graph-chart.component';
import { PieChartComponent } from './components/generic-components/chart-entity/charts-types/pie-chart/pie-chart.component';
import {MatMenuModule} from '@angular/material/menu';
import { GridsterBlockComponent } from './components/generic-components/chart-entity/charts-types/gridster-block/gridster-block.component';
import { StringDataComponent } from './components/generic-components/chart-entity/charts-types/string-data/string-data.component';



@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    LiveComponent,
    MonitorComponent,
    SignupComponent,
    ConfigComponent,
    AddNewDialogComponent,
    SidebarComponent,
    ChartComponent,
    TestComponent,
    SideBarParametersComponent,
    LiveDashboardComponent,
    ChartEntityComponent,
    GaugeChartComponent,
    GraphChartComponent,
    PieChartComponent,
    GridsterBlockComponent,
    StringDataComponent,
  ],
  imports: [
    GridsterModule,
    MatSelectModule,
    MatCheckboxModule,
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
    NgApexchartsModule,
    DropdownModule,
    HighchartsChartModule,
    ChartModule,
  ],
  providers: [HighchartsService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
