import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Vehicle } from 'src/app/iterfaces/vehicle';
import { MatDialog } from '@angular/material/dialog'
import { VehiculosDialogComponent, VehiculosDialogResult } from '../vehiculos-dialog/vehiculos-dialog.component';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent {
  vehiclesDB = collection(this.firestore, 'vehicles');

  constructor(private dialog: MatDialog, private firestore: Firestore) {}

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
