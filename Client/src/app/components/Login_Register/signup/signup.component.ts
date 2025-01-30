import { Component, Input } from '@angular/core';
import {Router} from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  protected  email: string = '';
  protected  password: string = '';
  protected repassword:string = '';

  constructor(private userservice: UserService , private route : Router) {}

  public TrySignUp(){
    if(this.password!==this.repassword){
      Swal.fire({
        title: 'change password',
        text:'password are not matching',
        icon:'warning'
      });
      return;
    }
    this.userservice.signup(this.email,this.password).subscribe(
      (res) =>{
        Swal.fire({
          title: 'created user',
          icon:'success'
        });
      },
      (error) => {
        console.log(error);
        Swal.fire({
          title: error.error.message,
          icon:'info'
        });      
      }
    )
    this.password = '';
    this.repassword = '';
    this.email = '';

  }
}
