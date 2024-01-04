import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
import { SitesService } from 'src/app/services/site.service';
import { Subscription } from 'rxjs';
import { Sites } from 'src/app/interfaces/site.class';
import { DefaultService } from 'src/app/services/default.service';
import { VehiculosService } from 'src/app/services/vehiculos.service';
import { Vehiculo } from 'src/app/interfaces/vehicle.class';
import { Favorite } from 'src/app/interfaces/favorite.decorator';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MarkerService, OpenRouteService]
})

export class MapComponent implements OnInit {
  // map
  private map: any;
  private routeLayer: any;

  // user
  private userID: string = "";
  btn = true;

  // route info (distance, time, cost)
  distanceInKMs: string | undefined;
  timeInMinutes: number | undefined;
  costRoute: number = 0;
  uniCost: string = "€";
  showRouteInfo: boolean = false;
  isMobilitySelected: boolean = false;
  mobilitySelected!: Mobility;

  // routes
  routeStrategy: RouteStrategy | undefined;
  route: Route | undefined;
  routeName: string = "";
  errorNameRoute: string = "";

  // sites
  sitesData: Sites[] = [];
  siteSubscription!: Subscription;
  panelOpenState = false;

  // vehicles
  mobilityData: Vehiculo[] = []; 
  mobilityOpenState = false;
  vehiclesSubscription!: Subscription;

  //default
  typeDefault = ""; //default
  defaultSubscription!: Subscription;
  //mobilitySelected -> default
  
  constructor(
    private markerService: MarkerService,
    private openRouteService: OpenRouteService,
    private router: Router,
    private mobilityService: MobilityService,
    private routeStrategyService: RouteStrategyService,
    private userService: UserService,
    private routeService: RouteService,
    private sitesService: SitesService,
    private defaultService: DefaultService,
    private vehiculoService: VehiculosService
    ) {
    }

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
        this.unsuscribeFromAllServices();
        if (this.routeLayer) {
          this.map.removeLayer(this.routeLayer);
        }
        this.markerService.removeMarkers();
        this.isMobilitySelected = false;
        this.showRouteInfo = false;
      } else {
        this.userID = user.uid;
        this.initSitesSubscription();
        this.initDefaultSubscription();
        this.initMobilitySubs();
      }
    });
  }

  private unsuscribeFromAllServices(): void {
    if (this.siteSubscription) {
      this.sitesData = [];
      this.siteSubscription.unsubscribe();
    }

    if (this.defaultSubscription) {
      this.defaultSubscription.unsubscribe();
    }

    if (this.vehiclesSubscription) {
      this.mobilityData = [];
      this.vehiclesSubscription.unsubscribe();
    }    
  }

  private initDefaultSubscription():void{
    this.defaultSubscription = this.defaultService.getDefault(this.userID).subscribe( async defaultRef =>{
      if (defaultRef[0] != undefined) {
        this.isMobilitySelected = true;
        if (defaultRef[0].nombreMobility == "A pie") {
            this.mobilitySelected = new Foot("A pie");
            this.typeDefault = defaultRef[0].estrategiaRoute;
        }
        else if(defaultRef[0].nombreMobility == "Bicicleta"){
            this.mobilitySelected = new Bike("Bicicleta", "Carretera");
            this.typeDefault = defaultRef[0].estrategiaRoute;
        }
        else {
            this.mobilitySelected = new Vehiculo(defaultRef[0].nombreMobility,
                                                defaultRef[0].marcaMobility,
                                                defaultRef[0].tipoMobility,
                                                defaultRef[0].consumoMobility);
        }
        this.typeDefault = defaultRef[0].estrategiaRoute;
        this.mobilityService.setMobilySelected(this.mobilitySelected);
        this.modifyTypeRoute(this.typeDefault);
    } else {
      this.defaultService.addDefaultToUserCollection(this.userID,new Bike("Bicicleta", "Bicicleta"),"type_3")
    }

      /*this.vehiculoService.getVehicleWithId(this.userID, defaultRef[0].vehiculo).subscribe(q => {
        this.mobilitySelected = q[0];
        console.log("valor devuelto de vehiculo " +  q[0])
      });*/

    });
  }
  

  private initSitesSubscription(): void {
    this.siteSubscription = this.sitesService.getSites(this.userID).subscribe( sites => {
      this.orderListSitesFav(sites);
    });
  }

  orderListSitesFav(sites: Sites[]){
    this.sitesData = sites.sort((a,b) => (b.favorite ? 1 : 0 - (a.favorite ? 1 : 0)));
  }

  private initMobilitySubs():void{
    this.vehiclesSubscription = this.vehiculoService.getVehicles(this.userID).subscribe( vehiclesRef => {
      this.orderListVehiclesFav(vehiclesRef);
    });
  }

  orderListVehiclesFav(vehicles:Vehiculo[]){
    this.mobilityData = vehicles;
    this.mobilityData.sort((a,b) => (b.favorite ? 1 : 0 - (a.favorite ? 1 : 0)));
  }

  selectedVehicle(vehicle: Mobility){
    var vehicleSelected = new Vehiculo(vehicle.nombre, vehicle.marca, vehicle.tipo, vehicle.consumo);
    this.mobilitySelected = vehicleSelected
    this.mobilityService.setMobilySelected(this.mobilitySelected);
  }

  selectedFoot(){
    this.mobilitySelected = new Foot("A pie");
    this.mobilityService.setMobilySelected(this.mobilitySelected);
  }

  selectedCicle(){
    this.mobilitySelected = new Bike("Bicicleta", "Carretera");
    this.mobilityService.setMobilySelected(this.mobilitySelected);
  }

  private initMobilitySubscription(): void {
    this.mobilityService.mobilitySubject.subscribe(
      data => {
        if (data != undefined && data[0]) {
          this.isMobilitySelected = this.mobilityService.isMobilitySelected();
          this.mobilitySelected = this.mobilityService.getMobilitySelected();
        }
      }
    );
  }

  private initMarkerSubsription(): void {
    this.markerService.markersSubject.subscribe(
      data => {
        if (data != undefined && data[0] && this.routeLayer) {
          this.showRouteInfo = false;
          this.map.removeLayer(this.routeLayer);
        }
      });
  }

  onRadioChange(event: any) {
    this.modifyTypeRoute(event.target.value);
  }

  modifyTypeRoute(type:string){
    if (type == "type_1"){
      this.routeStrategyService.setStrategySelected(new FastestRouteStrategy());
    } 
    if (type == "type_2"){
      this.routeStrategyService.setStrategySelected(new ShortestRouteStrategy());
    }
    if (type == "type_3") {
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

  calculateRoute(): void {
    if (this.markerService.isMaxMarkers() && this.mobilityService.isMobilitySelected() && this.routeStrategyService.isStrategySelected()){
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
    if (this.route && (document.getElementById('routeName') as HTMLTextAreaElement).value){
      this.route.nombre = this.routeName;
      const routeToAdd = {
        nombre: this.route.nombre,
        inicio: this.route.inicio,
        final: this.route.final,
        trayecto: this.route.trayecto,
        distancia: this.route.distancia,
        duracion: this.route.duracion,
        favorite: this.route.favorite
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
      this.errorNameRoute = "Pon nombre a la ruta.";
    }
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

  selectedSite(site: Sites): void {
    this.markerService.addSite(this.map, site);
  }
}