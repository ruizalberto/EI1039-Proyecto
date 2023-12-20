import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog'
import { Observable, Subscription } from 'rxjs';
import { Sites } from 'src/app/interfaces/site.class';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { SitesService } from 'src/app/services/site.service';
import { Geocoder, geocoders } from 'leaflet-control-geocoder';

import * as L from 'leaflet';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.component.html',
  styleUrls: ['./lugares.component.css']
})
export class LugaresComponent implements OnInit, AfterViewInit {
  sitesData: Sites[] = [];
  siteSubscription!: Subscription;
  userSubscription!: Subscription;
  userID: any;
  mapSite:any;

  selectedName: string = "";
  selectedLat: number = 0;
  selectedLon: number = 0;

  latitudTextArea: HTMLTextAreaElement | undefined;
  longitudTextArea: HTMLTextAreaElement | undefined;

  posMarker: L.Marker|null = null;
  
  constructor(private sitesService: SitesService,
              private userService: UserService) {}

  ngOnDestroy(): void {
    if (this.siteSubscription){
      this.siteSubscription.unsubscribe();
    }
    if (this.userSubscription){
      this.userSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.mapSite.on('click', (e: L.LeafletMouseEvent) => {
      this.mapSiteNewSite(e.latlng.lat, e.latlng.lng);
    });
    this.initGeocoderControl()
  }

  ngOnInit(): void {
    this.latitudTextArea = document.getElementById('latitud') as HTMLTextAreaElement;
    this.longitudTextArea = document.getElementById('longitud') as HTMLTextAreaElement;
    this.initUserSubscription();
  }

  private initMap(): void {
    this.mapSite = L.map('mapSites').setView([39.9874905, -0.0686626], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.mapSite);
  }

  private initUserSubscription() {
    this.userSubscription = this.userService.getInfoUserLogged().subscribe(user => {
      if (user){
        this.userID = user.uid;
        this.initSitesSubsrciption();
      }
    });
  }

  private initSitesSubsrciption() {
    this.siteSubscription = this.sitesService.getSites(this.userID).subscribe( sites => {
      this.sitesData = sites;
    })
  }

  private removeInfoShowed() {
    this.selectedName = "";
    this.selectedLat = 0;
    this.selectedLon = 0;
  }

  mapSiteNewSite(lat: number, lng: number){
    if (this.posMarker){
      this.mapSite.removeLayer(this.posMarker);
    }

    this.selectedLat = lat;
    this.selectedLon = lng;

    if (this.latitudTextArea && this.longitudTextArea){
      this.latitudTextArea.value = this.selectedLat.toString();
      this.longitudTextArea.value = this.selectedLon.toString();
    }

    this.posMarker = L.marker([this.selectedLat,this.selectedLon]).addTo(this.mapSite);
  }

  saveSite(){
    const siteToAdd = {
      name: this.selectedName,
      coorLat: this.selectedLat,
      coorLon: this.selectedLon
    };
    this.sitesService.addSiteToUserCollection(this.userID, siteToAdd)
    .then((docRef) => {
      console.log('Documento agregado con ID:', docRef.id);
    })
    .catch((error) => {
      console.error('Error al agregar documento:', error);
    });
    this.removeInfoShowed();
  }

  searchSite(){
    this.mapSiteNewSite(this.selectedLat,this.selectedLon);
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
      ]);
      this.selectedLat = e.geocode.center.lat;
      this.selectedLon = e.geocode.center.lng;
      this.selectedName = e.geocode.name;
      this.mapSiteNewSite(this.selectedLat,this.selectedLon)
      this.mapSite.fitBounds(poly.getBounds());
    }).addTo(this.mapSite);

  }

  deleteSite(site: Sites): void {
    console.log("entrando en delete");
    this.sitesService.removeSiteFromUserCollection(this.userID, site);
  }

  selectedSite(site: Sites){}
  modifySite(site: Sites){}
}

export interface SiteResult {
  site: Sites;
  delete?: boolean;
}
