import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './components/Login_Register/signin/signin.component';
import { TestComponent } from './components/test/test.component';
import { MainComponent } from './components/Live_View/main/main.component';
import { ConfigComponent } from './components/Live_View/config/config.component';
import { SignupComponent } from './components/Login_Register/signup/signup.component';
import { PageNotFoundComponent } from './components/Other_Logic/page-not-found/page-not-found.component';
import { MonitorComponent } from './components/Live_View/monitor/monitor.component';


const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  {path : 'main' , component : MainComponent},
  {path : 'error' , component : PageNotFoundComponent},
  {path : 'monitor', component :MonitorComponent},
  {path : 'test', component :TestComponent},
  { path: 'config', component: ConfigComponent },
  {path: '**',component:PageNotFoundComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
