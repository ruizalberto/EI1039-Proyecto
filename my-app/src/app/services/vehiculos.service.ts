import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, deleteDoc, doc, getDocs, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mobility } from '../interfaces/mobility.interface';
import { Vehiculo } from '../interfaces/vehicle.class';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  
  constructor(private firestore: Firestore) {}

  async addVehicleToUserCollection(userId: string, vehicle: Mobility): Promise<any> {
    const vehiclesRef = collection(this.firestore, 'users/' + userId + '/vehicles');
    return await addDoc(vehiclesRef, vehicle);
  }

  async removeVehicleFromUserCollection(userId: string, vehicle: Mobility): Promise<any> {
    const vehicleToRemoveRef = collection(this.firestore, 'users/', userId, '/vehicles');
    const querySnapshot = await getDocs(query(vehicleToRemoveRef,
      where('nombre', '==', vehicle.nombre),
      where('marca', '==', vehicle.marca),
      where('tipo', '==', vehicle.tipo),
      where('consumo', '==', vehicle.consumo)
    ));

    querySnapshot.forEach(async (doc) => {
      try {
        await deleteDoc(doc.ref);
        console.log(`Documento ${doc.id} eliminado correctamente.`);
      } catch (error) {
        console.error(`Error al eliminar documento ${doc.id}:`, error);
      }
    });
  }

  getVehicles(userID: string): Observable<Mobility[]> {
    const vehiclesRef = collection(this.firestore, 'users/' + userID + '/vehicles');
    return collectionData(vehiclesRef, { idField: userID }) as Observable<Mobility[]>;
  }
}
