import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Mobility } from '../interfaces/mobility.interface';

@Injectable({
  providedIn: 'root'
})
export class OpenRouteService {
  private apiKey = '5b3ce3597851110001cf6248a3077ea0c1364912a6cf737d6958d901';

  constructor(private http: HttpClient) { }

  getDirections(start: L.LatLng, end: L.LatLng, transporte: Mobility): Observable<any> {

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

  
}

