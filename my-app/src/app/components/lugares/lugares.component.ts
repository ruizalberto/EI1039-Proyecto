import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { MatIconModule } from '@angular/material/icon';
import { Observable, Subscription } from 'rxjs';
import { Sites } from 'src/app/interfaces/site.class';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SitesService } from 'src/app/services/site.service';
import { LugaresDialogComponent, SitesDialogResult } from './lugares-dialog/lugares-dialog.component';
import * as L from 'leaflet';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.component.html',
  styleUrls: ['./lugares.component.css']
})
export class LugaresComponent implements OnInit {
  sitesData: Sites[] = [];
  siteSubscription!: Subscription;
  userSubscription!: Subscription;
  userID: any;
  map:any;

  constructor(private dialog: MatDialog, 
              private router: Router, 
              private sitesService: SitesService,
              private userService: UserService) {}

  ngOnDestroy(): void {
    if (this.siteSubscription){
      this.siteSubscription.unsubscribe();
    }
    if (this.userSubscription){
      this.userSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.initUserSubscription();
    this.initMap()
    console.log("se ha iniciado todo")
  }

  private initMap(): void {
    this.map = L.map('map').setView([39.9874905, -0.0686626], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private initUserSubscription() {
    this.userSubscription = this.userService.getInfoUserLogged().subscribe(user => {
      if (user){
        this.userID = user.uid;
        this.initSitesSubsrciption();
      }
    });
  }

  private initSitesSubsrciption() {
    this.siteSubscription = this.sitesService.getSites(this.userID).subscribe( sites => {
      this.sitesData = sites;
    })
  }
  /*
  newSite(): void {
    const dialogRef = this.dialog.open(LugaresDialogComponent, {
      width: '270px',
      data: {
        site: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: SitesDialogResult|undefined) => {
        if (!result) {
          return;
        }
        this.sitesService.addSiteToUserCollection(this.userID, result.site)
        .then((docRef) => {
          console.log('Lugar agregado con ID:', docRef.id);
        })
        .catch((error) => {
          console.error('Error al agregar el lugar:', error);
        });
      });
  }*/

  selectedSite(site: Sites){

  }

  deleteSite(site:Sites){

  }

  modifySite(site: Sites){
    

    
  }
/*
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
  // }*/
}
