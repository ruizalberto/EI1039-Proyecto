import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/iterfaces/vehicle';
import { MatDialog } from '@angular/material/dialog'
import { VehiculosDialogComponent, VehiculosDialogResult } from '../vehiculos-dialog/vehiculos-dialog.component';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {
  vehiclesDB = collection(this.firestore, 'vehicles');
  vehiclesData: Vehicle[] = [];

  constructor(private dialog: MatDialog, private firestore: Firestore) {}

  ngOnInit(): void {
    this.getVehicles().subscribe( vehicles => {
      this.vehiclesData = vehicles;
    })
  }

  newVehicle(): void {
    const dialogRef = this.dialog.open(VehiculosDialogComponent, {
      width: '270px',
      data: {
        vehicle: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: VehiculosDialogResult|undefined) => {
        if (!result) {
          return;
        }
        addDoc(this.vehiclesDB, result.vehicle)
        .then((docRef) => {
          console.log('Documento agregado con ID:', docRef.id);
        })
        .catch((error) => {
          console.error('Error al agregar documento:', error);
        });
      });
  }

  getVehicles(): Observable<Vehicle[]> {
    return collectionData(this.vehiclesDB, { idField: 'id'}) as Observable<Vehicle[]>; 
  }

  // editTask(Vehicle: Vehicle): void {
  //   const dialogRef = this.dialog.open(TaskDialogComponent, {
  //     width: '270px',
  //     data: {
  //       task,
  //       enableDelete: true,
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((result: TaskDialogResult|undefined) => {
  //     if (!result) {
  //       return;
  //     }
  //     const dataList = this[list];
  //     const taskIndex = dataList.indexOf(task);
  //     if (result.delete) {
  //       dataList.splice(taskIndex, 1);
  //     } else {
  //       dataList[taskIndex] = task;
  //     }
  //   });
  // }
}
