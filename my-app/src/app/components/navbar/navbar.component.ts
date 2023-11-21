import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  title = 'EI1039 Proyecto';
  email = 'usuario@usuario.com';
  password = 'usuario';
  // logged: any;
  loggedSubscription!: Subscription;

  constructor(
    private userService: UserService,
    private router: Router
  ){}

  ngOnInit(): void {
    // this.loggedSubscription = this.userService.loggedSubject.subscribe(
    //   data => {
    //     if (data != undefined){
    //       this.logged = data;
    //     }
    //   })
    this.userService.login(this.email, this.password)
    .then(response => {
      console.log(response);
    })
      .catch(error => console.log(error));
  }

  // logIn() {
  //   this.userService.login(this.email, this.password)
  //   .then(response => {
  //     console.log(response);
  //   })
  //     .catch(error => console.log(error));
  // }

  // logOut() {
  //   this.userService.logout()
  //   .then(response => {
  //     console.log(response);
  //     this.router.navigate(['']);
  //   })
  //   .catch(error => console.log(error));
  // }
}
