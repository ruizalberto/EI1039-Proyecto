import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenRouteService {
  private apiKey = '5b3ce3597851110001cf6248a3077ea0c1364912a6cf737d6958d901'; // Reemplaza con tu clave API de OpenRouteService

  constructor(private http: HttpClient) { }

  // Método para obtener direcciones entre dos ubicaciones
  getDirections(start: string, end: string): Observable<any> {
    const url = 'https://api.openrouteservice.org/v2/directions/driving-car';
    
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('start', start)
      .set('end', end);

    return this.http.get(url, { params });
  }
}

