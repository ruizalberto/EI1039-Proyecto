import { Injectable, OnDestroy } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, authState } from '@angular/fire/auth';
import { Firestore, collection, deleteDoc, getDocs, getFirestore, query } from '@angular/fire/firestore';
import { User, signOut } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnDestroy {
  
  constructor(private auth: Auth, private firestore: Firestore) {}

  ngOnDestroy(): void {
    this.logout();
  }

  async register(email: string, password: string): Promise<any> {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    }
    catch(error) {
      return await error;
    }
  }

  async login(email: string, password: string): Promise<any> {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    }
    catch(error) {
      return await error;
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
        await this.remove(user, "/vehicles");
        await this.remove(user, "/default");
        await this.remove(user, "/sites");
        await this.remove(user, "/routes");
        await user.delete();
        console.log("Usuario eliminado correctamente");
      }
    } catch (error) {
      console.error("No se ha podido borrar el usuario:", error);
    }
  }
  
  private async remove(user: User, removeRef: string) {
    const toRemoveRef = collection(this.firestore, 'users/', user.uid, removeRef);
    const q = query(toRemoveRef);
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
      console.log(`Documento ${doc.id} eliminado correctamente`);
    });

  }
}