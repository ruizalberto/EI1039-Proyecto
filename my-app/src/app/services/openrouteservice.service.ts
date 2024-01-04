import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Mobility } from '../interfaces/mobility.interface';
import { RouteStrategy } from '../interfaces/route-strategy';
import { MobilityService } from './mobility.service';
import { RouteData } from '../interfaces/route-data.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenRouteService {
  private apiKey = '5b3ce3597851110001cf6248a3077ea0c1364912a6cf737d6958d901';
  private geometry: any;
  private distance: string = '';
  private time: number = 0;
  private costRoute: number = 0;
  private precioGasolina: number = 0;
  private precioLuz: any;

  routeSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  routeData$ = this.routeSubject.asObservable();

  constructor(private http: HttpClient, private mobilityService: MobilityService) {}
  
  getFuelPrice(): void {
    const fuelPriceUrl = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';

    this.http.get<any>(fuelPriceUrl).subscribe(
      fuelPriceData => {
        const fuelPrice: string = fuelPriceData.ListaEESSPrecio[3557]['Precio Gasoleo A'].replace(',', '.');
        const pricePerLiter: number = Number(fuelPrice);
        this.precioGasolina = pricePerLiter;
        console.log("Precio gasolina: " + this.precioGasolina);
      }
    );
  }

  getLightPrice(): void {
    const lightPriceUrl = "v1/prices/now?zone=PCB";
    
    this.http.get<any>(lightPriceUrl).subscribe({
      next: lightPriceData => {
        this.precioLuz = lightPriceData.price;
        console.log("Precio luz: " + this.precioLuz);
      },
      error: err => {
        console.log("Error al obtener precio de la luz: " + err);
      }
    });
  }

  private getDirections(start: L.LatLng, end: L.LatLng, transporte: Mobility, strategy: RouteStrategy): Observable<any> {
    const url = 'https://api.openrouteservice.org/v2/directions/' + transporte.perfil + '/geojson';
 
    const headers = new HttpHeaders()
      .set('Accept', 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8')
      .set('Content-Type', 'application/json')
      .set('Authorization', this.apiKey);

    const coordinates = [
      [start.lng, start.lat],
      [end.lng, end.lat]
    ];
        
    const body = {
      coordinates: coordinates,
      preference: strategy.getPreference()
    };

    return this.http.post<any>(url, body, { headers }).pipe(
      map(response => this.adaptResponse(response))
    );
  }

  private adaptResponse(response: any): RouteData {
    const adaptedData: RouteData = {
      distance: 0,
      time: 0,
      geometry: null
    };

    if (response && response.features && response.features.length > 0) {
      adaptedData.geometry = response.features[0].geometry;
      adaptedData.distance = response.features[0].properties.summary.distance / 1000;
      adaptedData.time = Math.ceil(response.features[0].properties.summary.duration / 60); 
    } else {
      console.error('No se encontraron datos de ruta en la respuesta.');
    }

    return adaptedData;
  }

  setRouteData(start: L.LatLng, end: L.LatLng, mobility: Mobility, strategy: RouteStrategy){
    this.getDirections(start, end, mobility, strategy).subscribe({
      next: adaptedResponse => {
        this.geometry = adaptedResponse.geometry;
        this.distance = adaptedResponse.distance.toFixed(2);
        this.time = Math.ceil(adaptedResponse.time);

        if (mobility.getPerfil() == "driving-car"){
          if (mobility.tipo == "Gasolina"){
            this.getFuelCost();
          } else if (mobility.tipo == "Eléctrico"){
            this.getLightCost();
          }
        } else if (mobility.getPerfil() == "cycling-regular") {
          this.getCosteBicicleta();
        } else if (mobility.getPerfil() == "foot-walking") {
          this.getCostePie();
        }
        
        this.updateRouteSubject();
      },
      error: err => {
        console.error('Error al obtener la ruta:', err);
      }
    });
  }

  getGeometry():any{ return this.geometry; }
  getDistance():string{ return this.distance; }
  getTime():number{ return this.time }

  updateRouteSubject(){
    const routeData = [this.geometry, this.distance, this.time, this.costRoute];
    this.routeSubject.next(routeData);
  }

  getFuelCost(){
    this.costRoute = Number((Number(this.distance) * 0.01 * this.mobilityService.getMobilitySelected().consumo * this.precioGasolina).toFixed(2));
  }

  getLightCost(){
    this.costRoute = Number((Number(this.distance) * 0.01 * this.mobilityService.getMobilitySelected().consumo * this.precioLuz * 0.001).toFixed(2));
  }

  getCosteBicicleta(){
    this.costRoute = Number((Number(this.distance) * this.mobilityService.getMobilitySelected().consumo).toFixed(2));
  }

  getCostePie(){
    this.costRoute = Number((Number(this.distance) * this.mobilityService.getMobilitySelected().consumo).toFixed(2));
  }
}

