import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { VehiculosDialogComponent, VehiculosDialogResult } from '../vehiculos-dialog/vehiculos-dialog.component';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Mobility } from 'src/app/interfaces/mobility.interface';
import { Router } from '@angular/router';
import { MobilityService } from 'src/app/services/mobility.service';
import { Vehiculo } from 'src/app/interfaces/vehicle.class';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {
  vehiclesDB: any;
  vehiclesData: Mobility[] = [];
  userSubscription!: Subscription;
  userInfo: any;

  constructor(private dialog: MatDialog, 
              private firestore: Firestore, 
              private router: Router, 
              private mobilityService: MobilityService,
              private userService: UserService) {}

  ngOnInit(): void {
    this.initUserSubscription();
  }

  private initUserSubscription() {
    this.userSubscription = this.userService.getInfoUserLogged().subscribe(user => {
      if (user){
        this.userInfo = user.uid;
        this.vehiclesDB = collection(this.firestore, 'users/'+ this.userInfo +'/vehicles');
        this.initGetVehiclesSubsrciption();
      }
    });
  }

  private initGetVehiclesSubsrciption() {
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

  getVehicles(): Observable<Mobility[]> {
    return collectionData(this.vehiclesDB, { idField: this.userInfo }) as Observable<Mobility[]>;
  }

  vehicleSelected(vehicle: Mobility){
    var vehicleSelected = new Vehiculo(vehicle.nombre, vehicle.marca, vehicle.tipo, vehicle.consumo);
    this.mobilityService.setMobilySelected(vehicleSelected);
    this.router.navigate(['/']);
  }

  deleteVehicle(vehicle: Mobility):void{}

  modifyVehicle(vehicle: Mobility):void{}

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
