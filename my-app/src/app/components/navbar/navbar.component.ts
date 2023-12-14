import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  title = 'EI1039 Proyecto';
  logged: boolean;
  userEmail: any;

  constructor(
    private userService: UserService,
    private router: Router
  ){ this.logged = false; }

  ngOnInit(): void {
    this.userLogged();
  }

  userLogged(){
    this.userService.getInfoUserLogged().subscribe(res=>{
      if(res != null){
        this.logged = true;
        this.userEmail = res.email;
      } else {
        this.logged = false;
      }
    });
  }

  logOut(): void {
    this.userService.logout()
      .then(response => {
        console.log(response);
        this.logged = false;
        this.router.navigate(['']);
      })
      .catch(error => console.log(error));
  }
}
