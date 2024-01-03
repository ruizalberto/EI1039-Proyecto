import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, deleteDoc, getDocs, query, where, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mobility } from '../interfaces/mobility.interface';

interface DefaultData {
    nombreMobility: string;
    marcaMobility: string;
    tipoMobility: string;
    consumoMobility: number;
    estrategiaRoute: string;
  }

@Injectable({
  providedIn: 'root'
})
export class DefaultService {
  
  private foundFirstDoc: boolean = false; // Variable para rastrear el primer documento encontrado si hay repetidos

  constructor(private firestore: Firestore) {
  }
  // SOLO AÑADIR CUANDO SE CREA LA CUENTA -> VALORES BASICOS BICICLETA Y type_3 (Recomendada)
  async addDefaultToUserCollection(userId: string, vehicleDefault: Mobility, estrategiaRoute: string): Promise<any> {
    const nombreMobility = vehicleDefault.nombre;
    const marcaMobility = vehicleDefault.marca;
    const tipoMobility = vehicleDefault.tipo;
    const consumoMobility = vehicleDefault.consumo;

    const defaultData = {nombreMobility, marcaMobility, tipoMobility, consumoMobility, estrategiaRoute}
    const defaultRef = collection(this.firestore, 'users/' + userId + '/default');
    return await addDoc(defaultRef, defaultData);
  }

  async modifyVehicleDefault(userId: string, vehicleUpdated: Mobility): Promise<any> {
    this.foundFirstDoc = false;
    const defaultToUpdateRef = collection(this.firestore, 'users/', userId, '/default');
    const querySnapshot = await getDocs(defaultToUpdateRef);

    querySnapshot.forEach((doc) => {
      if (!this.foundFirstDoc) { // Si todavía no hemos encontrado el primer documento
        try {
          updateDoc(doc.ref, {
            nombreMobility: vehicleUpdated.nombre,
            marcaMobility: vehicleUpdated.marca,
            tipoMobility: vehicleUpdated.tipo,
            consumoMobility: vehicleUpdated.consumo
          });
          console.log(`Documento ${doc.id} actualizado correctamente.`);
          this.foundFirstDoc = true;
        } catch (error) {
          console.error(`Error al modificar documento ${doc.id}:`, error);
        }
      }
    });
  }

  async modifyTypeDefault(userId: string, typeUpdated: string): Promise<any> {
    this.foundFirstDoc = false;
    const vehicleToUpdateRef = collection(this.firestore, 'users/', userId, '/default');
    const querySnapshot = await getDocs(query(vehicleToUpdateRef));

    querySnapshot.forEach((doc) => {
      if (!this.foundFirstDoc) { // Si todavía no hemos encontrado el primer documento
        try {
          updateDoc(doc.ref, {
            estrategiaRoute: typeUpdated,
          });
          console.log(`Documento ${doc.id} actualizado correctamente.`);
          this.foundFirstDoc = true;
        } catch (error) {
          console.error(`Error al actualizar documento ${doc.id}:`, error);
        }
      }
    });
  }

  getDefault(userID: string): Observable<DefaultData[]> {
    const defaultRef = collection(this.firestore, 'users/' + userID + '/default');
    return collectionData(defaultRef, { idField: userID }) as Observable<DefaultData[]>;
  }

  async checkIfDefaultIsRemoved(userId: string, vehicle: Mobility){
    this.foundFirstDoc = false;
    const vehicleToRemoveRef = collection(this.firestore, 'users/', userId, '/default');
    const querySnapshot = await getDocs(query(vehicleToRemoveRef,
      where('nombreMobility', '==', vehicle.nombre),
      where('marcaMobility', '==', vehicle.marca),
      where('consumoMobility', '==', vehicle.consumo),
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

  async checkIfDefaultIsModified(userId: string, vehiclePast: Mobility, vehicleUpdated: Mobility) {
    this.foundFirstDoc = false;
    const vehicleToRemoveRef = collection(this.firestore, 'users/', userId, '/default');
    const querySnapshot = await getDocs(query(vehicleToRemoveRef,
      where('nombreMobility', '==', vehiclePast.nombre),
      where('marcaMobility', '==', vehiclePast.marca),
      where('consumoMobility', '==', vehiclePast.consumo),
    ));

    querySnapshot.forEach((doc) => {
      if (!this.foundFirstDoc) { // Si todavía no hemos encontrado el primer documento
        try {
          updateDoc(doc.ref, {
            nombreMobility: vehicleUpdated.nombre,
            marcaMobility: vehicleUpdated.marca,
            tipoMobility: vehicleUpdated.tipo,
            consumoMobility: vehicleUpdated.consumo
          });
          console.log(`Documento ${doc.id} actualizado correctamente.`);
          this.foundFirstDoc = true;
        } catch (error) {
          console.error(`Error al actualizar documento ${doc.id}:`, error);
        }
      }
    });
  }
}
