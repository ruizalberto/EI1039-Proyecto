import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { Geocoder, geocoders } from 'leaflet-control-geocoder';
import { Subscription } from 'rxjs';
import { Bike } from 'src/app/interfaces/bike.class';
import { Foot } from 'src/app/interfaces/foot.class';
import { Mobility } from 'src/app/interfaces/mobility.interface';
import { Vehiculo } from 'src/app/interfaces/vehicle.class';
import { MarkerService } from 'src/app/services/marker.service';
import { MobilityService } from 'src/app/services/mobility.service';
import { OpenRouteService } from 'src/app/services/openrouteservice.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [MarkerService, OpenRouteService]
})

export class MapComponent implements AfterViewInit{
  private map;
  private markers: L.LatLng[];
  private markersSubscription!: Subscription;
  private routeSubscription!: Subscription;
  private routeLayer;
  
  
  //modoTransporte!: Mobility;
  //hayTransporteElegido: boolean;
  distanceInKMs: string | undefined;
  timeInMinutes: number | undefined;
  
  showRouteInfo: boolean = false;


  constructor(
    private markerService: MarkerService,
    private openRouteService: OpenRouteService,
    private route: ActivatedRoute,
    private mobilityService: MobilityService
  ) {
    //this.hayTransporteElegido = false;
    this.markers = []
  }

  private initMap(): void {
    this.map = L.map('map').setView([39.9874905, -0.0686626], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.markerService.makeMarkers(this.map);
    this.initGeocoderControl();
    this.markersSubscription = this.markerService.markersSubject.subscribe(
      data => {
        if (data != undefined && data[0]){
          this.markers = data;
          if(this.routeLayer){
            this.map.removeLayer(this.routeLayer);
          }
        }
      });
  }

  private initGeocoderControl() {
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
    if (this.markers.length == 2 && this.mobilityService.isMobilitySelected()){
      this.routeSubscription = this.openRouteService.getDirections(this.markers[0], this.markers[1], this.mobilityService.getMobilitySelected()).subscribe({
        next: response => {
            if (response && response.features && response.features.length > 0) {
              this.drawRoute(response.features[0].geometry);
              
              this.distanceInKMs = (response.features[0].properties.summary.distance/1000).toFixed(2);
              this.timeInMinutes = Math.ceil(response.features[0].properties.summary.duration/60);
              this.showRouteInfo = true;
            } else {
              console.error('No se encontraron datos de ruta en la respuesta.');
            }
          },
        error: err => {
          console.error('Error al obtener la ruta:', err);
        }
      })
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