import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EliminarCuentaDialogComponent } from '../eliminar-cuenta-dialog/eliminar-cuenta-dialog.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  title = 'THE HERMES PATH';
  logged: boolean;
  userEmail: any;
  userName: string="";

  constructor(
    private dialog: MatDialog,
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
        this.userName = this.userEmail.split("@")[0];
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
    })
    .catch(error => console.log(error));
  }

  openDialogRemoveAccount(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogRef = this.dialog.open(EliminarCuentaDialogComponent, {
      width: '250px',
      enterAnimationDuration,
      exitAnimationDuration
    });
    dialogRef
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.logged = false;
          this.userService.removeAccount();
          this.router.navigate(['']);
        }
      });
  }
}
