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
import { MainComponent } from './components/Live_View/main/main.component';
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
import { ButtonModule } from "primeng/button"; 
import { ToastModule } from "primeng/toast"; 
import { RippleModule } from "primeng/ripple"; 
import { ImageModule } from "primeng/image"; 
import { GoogleChartsModule } from 'angular-google-charts';


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    MainComponent,
    MonitorComponent,
    SignupComponent,
    ConfigComponent,
    TestComponent,
    AddNewDialogComponent,
    SidebarComponent,
    ChartComponent,
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
    ButtonModule,
    ToastModule,
    GoogleChartsModule.forRoot(), 
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class AppModule { }
