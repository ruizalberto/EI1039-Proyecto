import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  loggedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  loggeData$ = this.loggedSubject.asObservable();

  constructor(private auth: Auth) { 

  }

  register({ email, password }: any) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  login( email: any, password: any) {
    this.loggedSubject.next(true);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout(){
    this.loggedSubject.next(false);
    return signOut(this.auth);
  }
}
