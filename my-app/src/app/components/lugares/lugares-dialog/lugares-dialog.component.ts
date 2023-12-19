import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';
import { Sites } from 'src/app/interfaces/site.class';

@Component({
  selector: 'app-lugares-dialog',
  templateUrl: './lugares-dialog.component.html',
  styleUrls: ['./lugares-dialog.component.css']
})
export class LugaresDialogComponent implements AfterViewInit{
  private map: any;
  private backupSites: Partial<Sites> = { ...this.data.site };

  constructor(
    public dialogRef: MatDialogRef<LugaresDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SitesDialogData
  ) {  }

  ngAfterViewInit(): void {
    this.initMap(); 
  }


  validarFormulario(): boolean {
    return !!(
      this.data.site &&
      this.data.site.name &&
      this.data.site.coorLat &&
      this.data.site.coorLon
    );
  }
  private initMap(): void {
    this.map = L.map('map').setView([39.9874905, -0.0686626], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }
}

export interface SitesDialogData {
  site: Partial<Sites>;
  enableDelete: boolean;
}

export interface SitesDialogResult {
  site: Sites;
  delete?: boolean;
}

