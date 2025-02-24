import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './components/Login_Register/signin/signin.component';
import { TestComponent } from './components/test/test.component';
import { LiveComponent } from './components/Live_View/live/live.component';
import { ConfigComponent } from './components/Live_View/config/config.component';
import { SignupComponent } from './components/Login_Register/signup/signup.component';
import { PageNotFoundComponent } from './components/Other_Logic/page-not-found/page-not-found.component';
import { MonitorComponent } from './components/Live_View/monitor/monitor.component';
import { ArchiveDataComponent } from './components/Other_Logic/archive-data/archive-data.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  {path : 'live' , component : LiveComponent},
  {path : 'error' , component : PageNotFoundComponent},
  {path : 'monitor', component :MonitorComponent},
  {path : 'archive', component :ArchiveDataComponent},
  {path : 'test', component :TestComponent},
  { path: 'config', component: ConfigComponent },
  {path: '**',component:PageNotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
