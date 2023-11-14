import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import {Geocoder, geocoders} from 'leaflet-control-geocoder';
import { Subscription } from 'rxjs';
import { MarkerService } from 'src/app/services/marker.service';
import { OpenRouteService } from 'src/app/services/openrouteservice.service';

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
  private geocodeZone: any;


  constructor(
    private markerService: MarkerService,
    private openRouteService: OpenRouteService
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.markerService.makeCapitalMarkers(this.map);
    this.initGeocoderControl();
    this.markersSubscription = this.markerService.markersSubject.subscribe(
      data => {
        if (data != undefined && data[0]){
          this.markers = data;
          if(this.routeLayer){
            this.map.removeLayer(this.routeLayer);
          }
        }
      })
  }

  private initGeocoderControl() {
    new Geocoder({
      geocoder: new geocoders.Nominatim(),
      position: 'topleft',
      defaultMarkGeocode: false
    }).on('markgeocode', (e) => {
      this.geocodeZone = e.geocode.bbox;
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

  private initMap(): void {
    this.map = L.map('map').setView([39.9874905, -0.0686626], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  calculateRoute(): void {
    if (this.markers.length == 2){
      this.routeSubscription = this.openRouteService.getDirections(this.markers[0], this.markers[1]).subscribe(
        response => {
          this.drawRoute(response.features[0].geometry);
        }
      )
    }
  }

  private drawRoute(geometry: any): void{
    if(this.routeLayer){
      this.map.removeLayer(this.routeLayer);
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