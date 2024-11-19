import { Component, Input } from '@angular/core';
import {Router} from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  protected  email: string = '';
  protected  password: string = '';

  constructor(private userservice: UserService , private route : Router) {}

  public TrySignIn(){
    
    this.userservice.login(this.email,this.password).subscribe(
      (res) =>{
        console.log("sign in worked");
        this.route.navigate(['/main']);
      },
      (error) => {
        console.log("failed");
      }
    )
    this.password = '';

  }
}
