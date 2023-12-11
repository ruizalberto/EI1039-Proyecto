import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Mobility } from '../interfaces/mobility.interface';
import { MobilityService } from './mobility.service';

@Injectable({
  providedIn: 'root'
})
export class OpenRouteService {
  private apiKey = '5b3ce3597851110001cf6248a3077ea0c1364912a6cf737d6958d901';
  private geometry:any;
  private distance: string = ''; //distancia en kilometros
  private time: number = 0; //tiempo en minutos
  private costRoute: number = 0;

  routeSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  routeData$ = this.routeSubject.asObservable();

  constructor(private http: HttpClient, private mobilityService: MobilityService) { }

  private fuelPrice = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';
  private lightPrice = "https://cors-anywhere.herokuapp.com/https://api.preciodelaluz.org/v1/prices/now?zone=PCB";

  getFuelPrice(): Observable<any> {
    return this.http.get(this.fuelPrice);
  }
  getCosteCombustible(){
    this.getFuelPrice().subscribe(
      fuelPriceData => {
        const aux: String = fuelPriceData.ListaEESSPrecio[3557]['Precio Gasoleo A'];
        const precioGasolina = aux.replace(',','.');
        this.costRoute = Number(this.distance) * 0.01 * this.mobilityService.getMobilitySelected().consumo * Number(precioGasolina);
        this.costRoute = Number(this.costRoute.toFixed(2))
        this.updateRouteSubject();
      });
  }

  // FALLA ALGO AL SOLICITAR A LA API
  // FALTA ELEGIR EL TIPO DE PRECIO A UTILIZAR SEGUN EL TIPO DE TRANSPORTE.
  
  getLightPrice(): Observable<any> {
    return this.http.get<any>(this.lightPrice);
  }
  getCosteElectricidad(){
    this.getLightPrice().subscribe(
      lightPriceData => {
        console.log(lightPriceData);
      });
  }



  private getDirections(start: L.LatLng, end: L.LatLng, transporte: Mobility): Observable<any> {
    const url = 'https://api.openrouteservice.org/v2/directions/' + transporte.perfil;
    const startCoords = `${start.lng},${start.lat}`;
    const endCoords = `${end.lng},${end.lat}`;
    
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('start', startCoords)
      .set('end', endCoords);
    return this.http.get(url, { params });
  }

  //recibe los datos de la ruta y almacena en el servicio la geometria de la ruta la distancia y el tiempo
  setRouteData(start:L.LatLng, end:L.LatLng, mobility: Mobility){
    this.getDirections(start, end, mobility).subscribe({
      next: response => {
          if (response && response.features && response.features.length > 0) {
            this.geometry = response.features[0].geometry;
            this.distance = (response.features[0].properties.summary.distance/1000).toFixed(2);
            this.time = Math.ceil(response.features[0].properties.summary.duration/60);
            if(mobility.getPerfil() == "driving-car"){
              if(mobility.tipo == "Gasolina")
                this.getCosteCombustible();
              else if (mobility.tipo == "Electrico")
                this.getCosteElectricidad();
            } else if (mobility.getPerfil() == "cycling-regular")
                this.getCosteBicicleta();
              else if (mobility.getPerfil() == "foot-walking")
                this.getCostePie();

            this.updateRouteSubject();
            
          } else {
            console.error('No se encontraron datos de ruta en la respuesta.');
          }
        },
      error: err => {
        console.error('Error al obtener la ruta:', err);
      }
    });
  }

  getCosteBicicleta(){
    this.costRoute = Number(this.distance) * 45;
    this.updateRouteSubject();
  }
  getCostePie(){
    this.costRoute = Number(this.distance) * 75;
    this.updateRouteSubject();
  }

  getGeometry():any{ return this.geometry; }
  getDistance():string{ return this.distance; }
  getTime():number{ return this.time }

  updateRouteSubject(){
    const routeData = [this.geometry, this.distance, this.time, this.costRoute];
    this.routeSubject.next(routeData);
  }


}

