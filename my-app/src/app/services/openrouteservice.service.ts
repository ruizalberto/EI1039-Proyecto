import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenRouteService {
  private apiKey = '5b3ce3597851110001cf6248a3077ea0c1364912a6cf737d6958d901';

  constructor(private http: HttpClient) { }

  getDirections(start: L.LatLng, end: L.LatLng): Observable<any> {

    console.log("se llama a getDirections de OpenRouteService");
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
    const startCoords = `${start.lng},${start.lat}`;
    const endCoords = `${end.lng},${end.lat}`;
    console.log("startCoords:", startCoords);
    console.log("endCoords: ", endCoords);
    
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('start', startCoords)
      .set('end', endCoords);

    return this.http.get(url, { params });
  }
}

