import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon';
import { VehiculosDialogComponent, VehiculosDialogResult } from '../vehiculos-dialog/vehiculos-dialog.component';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Mobility } from 'src/app/interfaces/mobility.interface';
import { Router } from '@angular/router';
import { MobilityService } from 'src/app/services/mobility.service';
import { Vehiculo } from 'src/app/interfaces/vehicle.class';
import { UserService } from 'src/app/services/user.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent implements OnInit {
  vehiclesData: Mobility[] = [];
  vehiclesSubscription!: Subscription;
  userSubscription!: Subscription;
  userID: any;

  constructor(private dialog: MatDialog, 
              private router: Router, 
              private mobilityService: MobilityService,
              private userService: UserService,
              private vehiculosService: VehiculosService) {}

  ngOnDestroy(): void {
    if (this.vehiclesSubscription){
      this.vehiclesSubscription.unsubscribe();
    }
    if (this.userSubscription){
      this.userSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initUserSubscription();
  }

  private initUserSubscription() {
    this.userSubscription = this.userService.getInfoUserLogged().subscribe(user => {
      if (user){
        this.userID = user.uid;
        this.initVehiclesSubsrciption();
      }
    });
  }

  private initVehiclesSubsrciption() {
    this.vehiclesSubscription = this.vehiculosService.getVehicles(this.userID).subscribe( vehicles => {
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
        this.vehiculosService.addVehicleToUserCollection(this.userID, result.vehicle)
        .then((docRef) => {
          console.log('Documento agregado con ID:', docRef.id);
        })
        .catch((error) => {
          console.error('Error al agregar documento:', error);
        });
      });
  }

  vehicleSelected(vehicle: Mobility) {
    var vehicleSelected = new Vehiculo(vehicle.nombre, vehicle.marca, vehicle.tipo, vehicle.consumo);
    this.mobilityService.setMobilySelected(vehicleSelected);
    this.router.navigate(['/']);
  }

  deleteVehicle(vehicle: Mobility): void {
    this.vehiculosService.removeVehicleFromUserCollection(this.userID, vehicle);
    this.mobilityService.setIsMobilitySelected(false);
  }

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
