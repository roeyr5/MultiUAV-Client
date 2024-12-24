import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './components/signin/signin.component';
import { MainComponent } from './components/main/main.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { MonitorComponent } from './components/monitor/monitor.component';
import { SignupComponent } from './components/signup/signup.component';
import { ConfigComponent } from './components/config/config.component';
import { TestComponent } from './components/test/test.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  {path : 'main' , component : MainComponent},
  {path : 'error' , component : PageNotFoundComponent},
  {path : 'monitor', component :MonitorComponent},
  {path : 'test', component :TestComponent},
  { path: 'config', component: ConfigComponent },
  {path: '**',component:SigninComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
