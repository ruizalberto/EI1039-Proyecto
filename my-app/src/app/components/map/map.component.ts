import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Geocoder, geocoders } from 'leaflet-control-geocoder';
import { Mobility } from 'src/app/interfaces/mobility.interface';
import { MarkerService } from 'src/app/services/marker.service';
import { MobilityService } from 'src/app/services/mobility.service';
import { OpenRouteService } from 'src/app/services/openrouteservice.service';
import { Router } from '@angular/router';
import { RouteStrategyService } from 'src/app/services/route-strategy.service';
import { FastestRouteStrategy, RecommendedRouteStrategy, RouteStrategy, ShortestRouteStrategy } from 'src/app/interfaces/route-strategy';
import { Bike } from 'src/app/interfaces/bike.class';
import { Foot } from 'src/app/interfaces/foot.class';
import { UserService } from 'src/app/services/user.service';
import { RouteService } from 'src/app/services/route.service';
import { Route } from 'src/app/interfaces/route.class';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MarkerService, OpenRouteService]
})

export class MapComponent implements OnInit {
  private map: any;
  private routeLayer: any;
  private userID: string = "";
  btn = true;
  distanceInKMs: string | undefined;
  timeInMinutes: number | undefined;
  costRoute: number = 0;
  uniCost: string = "€";
  showRouteInfo: boolean = false;
  isMobilitySelected: boolean = false;
  mobilitySelected!: Mobility;
  routeStrategy: RouteStrategy | undefined;
  route: Route | undefined;
  routeName: string = "";

  constructor(
    private markerService: MarkerService,
    private openRouteService: OpenRouteService,
    private router: Router,
    private mobilityService: MobilityService,
    private routeStrategyService: RouteStrategyService,
    private userService: UserService,
    private routeService: RouteService
  ) {}

  ngOnInit(): void {
    this.openRouteService.getFuelPrice();
    this.openRouteService.getLightPrice();
    this.initMap();
    this.markerService.makeMarkers(this.map);
    this.initGeocoderControl();
    this.initMarkerSubsription();
    this.initMobilitySubscription();
    this.initUserSubscription();
  }

  private initUserSubscription() {
    this.userService.getInfoUserLogged().subscribe(user => {
      if (!user){
        this.isMobilitySelected = false;
        this.showRouteInfo = false;
      } else {
        this.userID = user.uid;
      }
    });
  }

  private initMobilitySubscription(): void {
    this.mobilityService.mobilitySubject.subscribe(
      data => {
        if ( data != undefined && data[0] ){
          this.isMobilitySelected = this.mobilityService.isMobilitySelected();
          this.mobilitySelected = this.mobilityService.getMobilitySelected();
        }
      }
    );
  }

  private initMarkerSubsription(): void {
    this.markerService.markersSubject.subscribe(
      data => {
        if (data != undefined && data[0] && this.routeLayer)
          this.map.removeLayer(this.routeLayer);
      });
  }

  onRadioChange(event: any) {
    if (event.value == 1){
      this.routeStrategyService.setStrategySelected(new FastestRouteStrategy());
    } 
    if (event.value == 2){
      this.routeStrategyService.setStrategySelected(new ShortestRouteStrategy());
    }
    if (event.value == 3) {
      this.routeStrategyService.setStrategySelected(new RecommendedRouteStrategy());
    }
  }

  private initMap(): void {
    this.map = L.map('map').setView([39.9874905, -0.0686626], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  private initGeocoderControl():void {
    new Geocoder({
      geocoder: new geocoders.Nominatim({
        geocodingQueryParams: {
          "countrycodes": "es"
        }
      }),
      position: 'topleft',
      defaultMarkGeocode: false
    }).on('markgeocode', (e) => {
      var bbox = e.geocode.bbox;
      var poly = L.polygon([
        bbox.getSouthEast(),
        bbox.getNorthEast(),
        bbox.getNorthWest(),
        bbox.getSouthWest()
      ])
      this.map.fitBounds(poly.getBounds());
    }).addTo(this.map);
  }

  eligeVehiculo():void{
    this.router.navigate(['/vehiculos']);
  }

  calculateRoute(): void {
    if (this.markerService.isMaxMarkers() && this.mobilityService.isMobilitySelected() && this.routeStrategyService.isStrategySelected()){
      this.isMobilitySelected = this.mobilityService.isMobilitySelected();
      this.mobilitySelected = this.mobilityService.getMobilitySelected();
      this.openRouteService.setRouteData(
        this.markerService.getStart(),
        this.markerService.getEnd(),
        this.mobilityService.getMobilitySelected(),
        this.routeStrategyService.getStrategySelected()
        );
      this.openRouteService.routeSubject.subscribe(
        data => {
          if (data != undefined && data[0]){
            this.drawRoute(data[0]);
            this.distanceInKMs = data[1] as string;
            this.timeInMinutes = data[2] as number;
            this.costRoute = data[3] as number;
        
            this.setRouteData(this.markerService.getStart().toString(), this.markerService.getEnd().toString(), data[0], this.distanceInKMs, this.timeInMinutes);
            if ( this.mobilitySelected.getPerfil() == "driving-car" ){
              this.uniCost = "€";
            } else {
              this.uniCost = "Calorias";
            }
            this.showRouteInfo = true;
          }
        } 
      );
    }
  }

  private setRouteData(inicio: string, final: string, geometry: any, distance: string, time: number): void {
    const coordinates = geometry.coordinates;
    this.route = new Route("", inicio, final, coordinates, distance, time);
  }

  saveRoute(): void {
    if (this.route){
      this.route.nombre = this.routeName;
      const routeToAdd = {
        nombre: this.route.nombre,
        inicio: this.route.inicio,
        final: this.route.final,
        trayecto: this.route.trayecto,
        distancia: this.route.distancia,
        duracion: this.route.duracion
      };

      this.routeService.addRouteToUserCollection(this.userID, routeToAdd)
      .then((docRef) => {
        console.log('Documento agregado con ID:', docRef.id);
        this.router.navigate(['/rutas']);
      })
      .catch((error) => {
        console.error('Error al agregar documento:', error);
      });
    } else {
      console.log("No se ha podido guardar el nombre de la ruta...");
    }
  }

  cicleBoton() {
    var bike = new Bike("Bicicleta","Bicicleta");
    this.mobilityService.setMobilySelected(bike);
  }

  footBoton() {
    var foot = new Foot("A pie");
    this.mobilityService.setMobilySelected(foot);
  }

  private drawRoute(geometry: any): void{
    if(this.routeLayer)
      this.map.removeLayer(this.routeLayer);
    
    this.routeLayer = L.geoJSON(geometry, {
      style: {
        color: 'purple',
        weight: 3,
      }
    }).addTo(this.map);
    this.map.fitBounds(this.routeLayer.getBounds());
  }
}