import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  title = 'EI1039 Proyecto';
  email = 'usuario@usuario.com';
  password = 'usuario';
  logged = false;

  constructor(
    private userService: UserService
  ){}

  logIn() {
    this.userService.login(this.email, this.password)
      .then(response => {
        this.logged = true;        
      })
      .catch(error => console.log(error));
  }

  logOut() {
    this.userService.logout()
    .then(() => {
      this.logged = false;
    })
    .catch(error => console.log(error));
  }
}
