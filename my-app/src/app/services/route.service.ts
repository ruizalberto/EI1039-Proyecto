import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, arrayUnion, updateDoc, GeoPoint } from '@angular/fire/firestore';
import { Route } from '../interfaces/route.class';

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
}
