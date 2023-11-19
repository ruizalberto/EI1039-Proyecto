import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { Geocoder, geocoders } from 'leaflet-control-geocoder';
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
  private routeLayer;
  distanceInKMs: string | undefined;
  timeInMinutes: number | undefined;
  showRouteInfo: boolean = false;


  constructor(
    private markerService: MarkerService,
    private openRouteService: OpenRouteService,
    //private route: ActivatedRoute,
    private mobilityService: MobilityService
  ) {

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
    this.markerService.markersSubject.subscribe(
      data => {
        if (data != undefined && data[0] && this.routeLayer)
          this.map.removeLayer(this.routeLayer);
      });
  }

  private initGeocoderControl():void {
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
    if (this.markerService.isMaxMarkers() && this.mobilityService.isMobilitySelected()){
      
      this.openRouteService.setRouteData(
        this.markerService.getStart(),
        this.markerService.getEnd(), 
        this.mobilityService.getMobilitySelected());
        this.openRouteService.routeSubject.subscribe(
          data =>{
            if (data != undefined && data[0])
              this.drawRoute(data[0]);
              this.distanceInKMs = data[1] as string;
              this.timeInMinutes = data[2] as number;
              this.showRouteInfo = true;
          }
        )
  }
}

  private drawRoute(geometry: any): void{
    if(this.routeLayer)
      this.map.removeLayer(this.routeLayer);
    
    this.routeLayer = L.geoJSON(geometry, {
      style: {
        color: 'purple',
        weight: 3,
      }
    }).addTo(this.map);
    this.map.fitBounds(this.routeLayer.getBounds());
  }
}