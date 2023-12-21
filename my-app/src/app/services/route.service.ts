import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, arrayUnion, updateDoc, GeoPoint, collectionData } from '@angular/fire/firestore';
import { Route } from '../interfaces/route.class';
import { Observable } from 'rxjs';
import { Sites } from '../interfaces/site.class';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private foundFirstDoc: boolean = false; // Variable para rastrear el primer documento encontrado si hay repetidos
  
  constructor(private firestore: Firestore) {}

  async addRouteToUserCollection(userId: string, route: Route): Promise<any> {
    const routeCopy = { ...route };

    const firebaseCoordinates = routeCopy.trayecto.map(coord => new GeoPoint(coord[1], coord[0]));
    routeCopy.trayecto = firebaseCoordinates;

    const routeRef = collection(this.firestore, 'users/' + userId + '/routes');
    return await addDoc(routeRef, routeCopy);
  }

  getRoutes(userID: string): Observable<Route[]> {
    const routesRef = collection(this.firestore, 'users/' + userID + '/routes');
    return collectionData(routesRef, { idField: userID }) as Observable<Route[]>;
  }
}
