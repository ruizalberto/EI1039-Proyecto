import { Component, OnInit, OnDestroy } from '@angular/core';
import { Firestore, collection, addDoc, collectionData } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { Mobility } from 'src/app/interfaces/mobility.interface';
import { Router } from '@angular/router';
import { Vehiculo } from 'src/app/interfaces/vehicle.class';
import { UserService } from 'src/app/services/user.service';
import { Route } from 'src/app/interfaces/route.class';
import { RouteService } from 'src/app/services/route.service';

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.component.html',
  styleUrls: ['./rutas.component.css']
})
export class RutasComponent implements OnInit {
  routesData: Route[] = [];
  routeSubscription!: Subscription;
  userSubscription!: Subscription;
  userID: any;

  constructor(private router: Router,
              private userService: UserService,
              private routeService: RouteService) {}

  ngOnDestroy(): void {
    if (this.routeSubscription){
      this.routeSubscription.unsubscribe();
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
        this.initRoutesSubsrciption();
      }
    });
  }

  private initRoutesSubsrciption() {
    this.routeSubscription = this.routeService.getRoutes(this.userID).subscribe( routes => {
      this.routesData = routes;
    })
  }
  
  selectedRoute(route: Route) {
    /*var vehicleSelected = new Vehiculo(vehicle.nombre, vehicle.marca, vehicle.tipo, vehicle.consumo);
    this.mobilityService.setMobilySelected(vehicleSelected);
    this.router.navigate(['/']);*/
  }

  deleteRoute(route: Route): void {/*
    this.vehiculosService.removeVehicleFromUserCollection(this.userID, vehicle);
    this.mobilityService.setIsMobilitySelected(false);*/
  }
}
