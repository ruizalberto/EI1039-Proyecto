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

  deleteRoute(route: Route): void {
    this.routeService.removeRouteFromUserCollection(this.userID, route);
  }

  transformarCoordenadas(coordenadas: string): string {
    // Lógica para manipular las coordenadas
    const coordenadasArray = coordenadas.match(/-?\d+\.\d+/g); // Extraer valores numéricos
    if (coordenadasArray && coordenadasArray.length >= 2) {
      return `${coordenadasArray[0]}, ${coordenadasArray[1]}`;
    } else {
      return coordenadas; // Devolver las coordenadas originales si no se pueden manipular
    }
  }
}
