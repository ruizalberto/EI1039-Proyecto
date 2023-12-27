import { Injectable } from "@angular/core";
import { Firestore, collection, addDoc, collectionData, deleteDoc, doc, getDocs, query, where, updateDoc } from '@angular/fire/firestore';
import { Sites } from "../interfaces/site.class";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
export class SitesService {
  private foundFirstDoc: boolean = false;

  constructor(private firestore: Firestore) {}

  async addSiteToUserCollection(userId: string, site: Sites): Promise<any> {
    const sitesRef = collection(this.firestore, 'users/' + userId + '/sites');
    return await addDoc(sitesRef, site);
  }

  async removeSiteFromUserCollection(userId: string, site: Sites): Promise<any> {
    this.foundFirstDoc = false;
    const siteToRemoveRef = collection(this.firestore, 'users/', userId, '/sites');
    const querySnapshot = await getDocs(query(siteToRemoveRef,
      where('name', '==', site.name),
      where('coorLat', '==', site.coorLat),
      where('coorLon', '==', site.coorLon)
    ));

    querySnapshot.forEach((doc) => {
      if (!this.foundFirstDoc) { // Si todavía no hemos encontrado el primer documento
        try {
          deleteDoc(doc.ref);
          console.log(`Documento ${doc.id} eliminado correctamente.`);
          this.foundFirstDoc = true;
        } catch (error) {
          console.error(`Error al eliminar documento ${doc.id}:`, error);
        }
      }
    });
  }

  getSites(userID: string): Observable<Sites[]> {
    const sitesRef = collection(this.firestore, 'users/' + userID + '/sites');
    return collectionData(sitesRef, { idField: userID }) as Observable<Sites[]>;
  }


  async modifySiteFavorite(userId: string, siteSelected: Sites): Promise<any> {
    this.foundFirstDoc = false;
    const siteToUpdateRef = collection(this.firestore, 'users/', userId, '/sites');
    const querySnapshot = await getDocs(query(siteToUpdateRef,
      where('name', '==', siteSelected.name),
      where('coorLat', '==', siteSelected.coorLat),
      where('coorLon', '==', siteSelected.coorLon)
    ));

    querySnapshot.forEach((doc) => {
      if (!this.foundFirstDoc) { // Si todavía no hemos encontrado el primer documento
        try {
          updateDoc(doc.ref, {
            favorite: siteSelected.favorite,
          });
          console.log(`Documento ${doc.id} actualizado correctamente.`);
          this.foundFirstDoc = true;
        } catch (error) {
          console.error(`Error al eliminar documento ${doc.id}:`, error);
        }
      }
    });
  }
}
