import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { BehaviorSubject } from 'rxjs';
import { Sites } from '../interfaces/site.class';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  private readonly maxMarkers = 2;
  private markers: L.Marker[] = [];
  markersSubject: BehaviorSubject<L.LatLng[]> = new BehaviorSubject<L.LatLng[]>([]);
  markersData$ = this.markersSubject.asObservable();

  constructor() {}

  makeMarkers(map: L.Map): void {
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.markers.length < this.maxMarkers){
        const lon = e.latlng.lng;
        const lat = e.latlng.lat;

        const marker = L.marker([lat, lon])
          .addTo(map)
          .bindPopup('Click derecho para eliminar')
          .on('contextmenu', () => {
            map.removeLayer(marker);
            this.markers = this.markers.filter(m => m !== marker);
            this.updateMarkersSubject();
          });

        this.markers.push(marker);
        this.updateMarkersSubject();
      }
    });
  }

  addSite(map: L.Map, site: Sites): void {
    if (this.markers.length < this.maxMarkers) {
      const marker = L.marker([site.coorLat, site.coorLon])
        .addTo(map)
        .bindPopup('Click derecho para eliminar')
        .on('contextmenu', () => {
          map.removeLayer(marker);
          this.markers = this.markers.filter(m => m !== marker);
          this.updateMarkersSubject();
        });

      this.markers.push(marker);
      this.updateMarkersSubject();
    }
  }

  getCountMarkers(): number { return this.markers.length; }
  isMaxMarkers(): boolean { return this. markers.length === this.maxMarkers; }
  getStart(): L.LatLng { return this.markers[0].getLatLng(); }
  getEnd(): L.LatLng { return this.markers[1].getLatLng(); }

  private updateMarkersSubject(): void {
    const markerPositions = this.markers.map(marker => marker.getLatLng());
    this.markersSubject.next(markerPositions);
  }
}