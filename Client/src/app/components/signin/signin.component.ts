import { Component, Input } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent {
  protected  email: string = '';
  protected  password: string = '';

  constructor(private userservice: UserService) {}

  public TrySignIn(){
    
    this.userservice.login(this.email,this.password).subscribe(
      (res) =>{
        console.log("sign in worked");
        console.log(res);
      },
      (error) => {
        console.log("failed");
      }
    )
    this.password = '';

  }
}
