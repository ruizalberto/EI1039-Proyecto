import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, deleteDoc, getDocs, query, where, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mobility } from '../interfaces/mobility.interface';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private foundFirstDoc: boolean = false; // Variable para rastrear el primer documento encontrado si hay repetidos
  
  constructor(private firestore: Firestore) {}

  async addVehicleToUserCollection(userId: string, vehicle: Mobility): Promise<any> {
    const vehiclesRef = collection(this.firestore, 'users/' + userId + '/vehicles');
    return await addDoc(vehiclesRef, vehicle);
  }

  async removeVehicleFromUserCollection(userId: string, vehicle: Mobility): Promise<any> {
    this.foundFirstDoc = false;
    const vehicleToRemoveRef = collection(this.firestore, 'users/', userId, '/vehicles');
    const querySnapshot = await getDocs(query(vehicleToRemoveRef,
      where('nombre', '==', vehicle.nombre),
      where('marca', '==', vehicle.marca),
      where('tipo', '==', vehicle.tipo),
      where('consumo', '==', vehicle.consumo)
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

  async modifyVehicleFromUserCollection(userId: string, vehiclePast: Mobility, vehicleUpdated: Mobility): Promise<any> {
    this.foundFirstDoc = false;
    const vehicleToUpdateRef = collection(this.firestore, 'users/', userId, '/vehicles');
    const querySnapshot = await getDocs(query(vehicleToUpdateRef,
      where('nombre', '==', vehiclePast.nombre),
      where('marca', '==', vehiclePast.marca),
      where('tipo', '==', vehiclePast.tipo),
      where('consumo', '==', vehiclePast.consumo)
    ));

    querySnapshot.forEach((doc) => {
      if (!this.foundFirstDoc) { // Si todavía no hemos encontrado el primer documento
        try {
          updateDoc(doc.ref, {
            nombre: vehicleUpdated.nombre,
            marca: vehicleUpdated.marca,
            tipo: vehicleUpdated.tipo,
            consumo: vehicleUpdated.consumo,
          });
          console.log(`Documento ${doc.id} actualizado correctamente.`);
          this.foundFirstDoc = true;
        } catch (error) {
          console.error(`Error al eliminar documento ${doc.id}:`, error);
        }
      }
    });
  }

  getVehicles(userID: string): Observable<Mobility[]> {
    const vehiclesRef = collection(this.firestore, 'users/' + userID + '/vehicles');
    return collectionData(vehiclesRef, { idField: userID }) as Observable<Mobility[]>;
  }
}
