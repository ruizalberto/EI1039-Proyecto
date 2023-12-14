import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  @ViewChild("email") email! : ElementRef;
  @ViewChild("password") password! : ElementRef;

  constructor(private userService: UserService, private router: Router) { }

  login():void{
    var email = this.email.nativeElement.value;
    var password = this.password.nativeElement.value;
    this.userService.login(email, password).then(res=>{
      console.log(res);
      this.router.navigate(['']);
    });
  }
}
