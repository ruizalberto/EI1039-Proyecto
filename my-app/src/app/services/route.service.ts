import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, deleteDoc, GeoPoint, collectionData, getDocs, query, where } from '@angular/fire/firestore';
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

  async removeRouteFromUserCollection(userId: string, route: Route): Promise<any> {
    this.foundFirstDoc = false;
    const routeToRemoveRef = collection(this.firestore, 'users/', userId, '/routes');
    const querySnapshot = await getDocs(query(routeToRemoveRef,
      where('nombre', '==', route.nombre),
      where('distancia', '==', route.distancia),
      where('duracion', '==', route.duracion)
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

  getRoutes(userID: string): Observable<Route[]> {
    const routesRef = collection(this.firestore, 'users/' + userID + '/routes');
    return collectionData(routesRef, { idField: userID }) as Observable<Route[]>;
  }
}
