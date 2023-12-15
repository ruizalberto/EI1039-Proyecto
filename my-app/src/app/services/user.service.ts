import { Injectable, OnDestroy } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, authState, deleteUser } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  
  constructor(private auth: Auth) {}

  ngOnDestroy(): void {
    this.logout();
  }

  async register(email: string, password: string) {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    }
    catch(error) {
      alert("No se ha podido hacer el log-in correctamente. Error: " + error)
      return null;
    }
  }

  async login(email: string, password: string) {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    }
    catch(error) {
      alert("No se ha podido hacer el log-in correctamente. Error: " + error)
      return null;
    }
  }

  async logout(){
    return signOut(this.auth);
  }

  getInfoUserLogged() {
    return authState(this.auth);
  }

  async removeAccount() {
    try {
      const user = this.auth.currentUser;
      if (user) {
        await user.delete();
        console.log("Usuario eliminado correctamente");
      }
    } catch (error) {
      console.error("No se ha podido borrar el usuario:", error);
    }
  }
}
