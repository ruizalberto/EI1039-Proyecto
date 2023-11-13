import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { Subscription } from 'rxjs';
import { MarkerService } from 'src/app/services/marker.service';
import { OpenRouteService } from 'src/app/services/openrouteservice.service';

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

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MarkerService, OpenRouteService]
})
export class MapComponent implements AfterViewInit{
  private map: any;
  private markers!: L.LatLng[];
  private markersSubscription!: Subscription;
  private routeSubscription!: Subscription;
  private routeLayer: any;

  constructor(
    private markerService: MarkerService,
    private openRouteService: OpenRouteService
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.markerService.makeCapitalMarkers(this.map);
    this.markersSubscription = this.markerService.markersSubject.subscribe(
      data => {
        if (data != undefined && data[0]){
          this.markers = data;
          console.log(this.markers);
          console.log("subscripcion: ", this.markers[0]);
        }
      })
  }

  private initMap(): void {
    this.map = L.map('map').setView([39.9874905, -0.0686626], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  calcularRuta(): void {
    this.routeSubscription = this.openRouteService.getDirections(this.markers[0], this.markers[1]).subscribe(
      response => {
        this.drawRoute(response.features[0].geometry);
      }
    )
  }

  private drawRoute(geometry: any): void{
    if(this.routeLayer){
      this.map.removeLayer(this.routeLayer)
    }
    this.routeLayer = L.geoJSON(geometry, {
      style: {
        color: 'purple',
        weight: 3,
      }
    }).addTo(this.map);
    this.map.fitBounds(this.routeLayer.getBounds());
  }
}