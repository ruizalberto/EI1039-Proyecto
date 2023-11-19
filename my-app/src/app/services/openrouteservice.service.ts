import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Mobility } from '../interfaces/mobility.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenRouteService {
  private apiKey = '5b3ce3597851110001cf6248a3077ea0c1364912a6cf737d6958d901';
  private geometry:any;
  private distance: string = ''; //distancia en kilometros
  private time: number = 0; //tiempo en minutos

  routeSubject: BehaviorSubject<Object[]> = new BehaviorSubject<Object[]>([]);
  routeData$ = this.routeSubject.asObservable();

  constructor(private http: HttpClient) { }

  private getDirections(start: L.LatLng, end: L.LatLng, transporte: Mobility): Observable<any> {

    const url = 'https://api.openrouteservice.org/v2/directions/' + transporte.perfil;
    const startCoords = `${start.lng},${start.lat}`;
    const endCoords = `${end.lng},${end.lat}`;
    
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('start', startCoords)
      .set('end', endCoords);

    console.log(transporte);
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
            this.updateRouteSubject();
          } else {
            console.error('No se encontraron datos de ruta en la respuesta.');
          }
        },
      error: err => {
        console.error('Error al obtener la ruta:', err);
      }
    })
  }

  getGeometry():any{ return this.geometry; }
  getDistance():string{ return this.distance; }
  getTime():number{ return this.time }

  updateRouteSubject(){
    const routeData = [this.geometry,this.distance,this.time];
    this.routeSubject.next(routeData);
  }

}

