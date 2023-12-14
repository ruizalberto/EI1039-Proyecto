import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  @ViewChild("email") email! : ElementRef;
  @ViewChild("password") password! : ElementRef;

  constructor(private userService : UserService, private router : Router) { }

  ngOnInit(): void {
  }

  registro():void{
    var email = this.email.nativeElement.value;
    var password = this.password.nativeElement.value;
    this.userService.register(email, password).then(res=>{
      console.log(res);
      this.router.navigate(['']);
    });
  }
}
