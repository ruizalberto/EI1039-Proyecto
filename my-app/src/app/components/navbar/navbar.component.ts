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

  constructor(
    private userService: UserService
  ){}

  logIn() {
    this.userService.login(this.email, this.password)
      .then(response => {
        console.log(response);
      })
      .catch(error => console.log(error));
  }
}
