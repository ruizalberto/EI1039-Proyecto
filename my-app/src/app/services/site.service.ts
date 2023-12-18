import { Injectable } from "@angular/core";
import { Firestore, collection, addDoc, collectionData, deleteDoc, doc, getDocs, query, where } from '@angular/fire/firestore';
import { Sites } from "../interfaces/site.class";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
  })
export class SitesService{

  constructor(private firestore: Firestore) {}

  getSites(userID: string): Observable<Sites[]> {
    const sitesRef = collection(this.firestore, 'users/' + userID + '/sites');
    return collectionData(sitesRef, { idField: userID }) as Observable<Sites[]>;
  }

  async addSiteToUserCollection(userId: string, site: Sites): Promise<any> {
    const sitesRef = collection(this.firestore, 'users/' + userId + '/sites');
    return await addDoc(sitesRef, site);
  }

}