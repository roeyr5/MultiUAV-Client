import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './components/signin/signin.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MainComponent } from './components/main/main.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {GridsterModule} from 'angular-gridster2';
import { MonitorComponent } from './components/monitor/monitor.component';
import { SignupComponent } from './components/signup/signup.component';
import { ConfigComponent } from './components/config/config.component';
import { TestComponent } from './components/test/test.component';
import { AddNewDialogComponent } from './components/dialogs/add-new-dialog.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MatIconModule } from '@angular/material/icon';
import { SidebarComponent } from './components/sidebar/sidebar.component'; 
import { MatCheckboxModule } from '@angular/material/checkbox';

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
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
