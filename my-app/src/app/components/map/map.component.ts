import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { Geocoder, geocoders } from 'leaflet-control-geocoder';
import { Mobility } from 'src/app/interfaces/mobility.interface';
import { MarkerService } from 'src/app/services/marker.service';
import { MobilityService } from 'src/app/services/mobility.service';
import { OpenRouteService } from 'src/app/services/openrouteservice.service';
import { Router } from '@angular/router';

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
  costRoute: number | undefined;

  showRouteInfo: boolean = false;
  isMobilitySelected:boolean = false;
  mobilitySelected!: Mobility;



  constructor(
    private markerService: MarkerService,
    private openRouteService: OpenRouteService,
    private router: Router,
    private mobilityService: MobilityService
  ) {
    this.mobilityService.mobilitySubject.subscribe(
      data => {
        if ( data != undefined && data[0] ){
          this.isMobilitySelected = this.mobilityService.isMobilitySelected();
          this.mobilitySelected = this.mobilityService.getMobilitySelected();
        }
      }
    );
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

  eligeVehiculo():void{
    this.router.navigate(['/vehiculos'])
  }

  calculateRoute(): void {
    if (this.markerService.isMaxMarkers() && this.mobilityService.isMobilitySelected()){
      this.isMobilitySelected = this.mobilityService.isMobilitySelected();
      this.mobilitySelected = this.mobilityService.getMobilitySelected();
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
              this.costRoute = data[3] as number;
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