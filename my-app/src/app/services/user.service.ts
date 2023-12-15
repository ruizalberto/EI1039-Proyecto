import { Injectable, OnDestroy } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, authState } from '@angular/fire/auth';
import { Firestore, collection, deleteDoc, getDocs, getFirestore, query } from '@angular/fire/firestore';
import { signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  
  constructor(private auth: Auth, private firestore: Firestore) {}

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
        const vehiclesRef = collection(this.firestore, 'users/', user.uid, '/vehicles');
        const q = query(vehiclesRef);
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
          console.log(`Documento ${doc.id} eliminado correctamente`);
        });
        await user.delete();
        console.log("Usuario eliminado correctamente");
      }
    } catch (error) {
      console.error("No se ha podido borrar el usuario:", error);
    }
  }
  
}
