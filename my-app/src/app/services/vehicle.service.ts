import { Injectable } from '@angular/core';
import { Vehicle } from '../iterfaces/vehicle';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  
  // private vehiclesDB: AngularFireList<Vehicle>;
  

  // constructor(private db: AngularFireDatabase) { 
  //   this.vehiclesDB = this.db.list('/vehicles', (ref)=>
  //     ref.orderByChild('nombre')
  //   );
  // }

  // getVehicles(): Observable<Vehicle[]>{
  //   return this.vehiclesDB.snapshotChanges().pipe(
  //     map((changes) => {
  //       return changes.map((c) => ({
  //         $key: c.payload.key,
  //         ...c.payload.val(),
  //       }));
  //     })
  //   );
  // }
}
