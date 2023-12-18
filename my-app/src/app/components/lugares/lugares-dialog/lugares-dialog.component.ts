import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mobility } from 'src/app/interfaces/mobility.interface';
import { Sites } from 'src/app/interfaces/site.class';

@Component({
  selector: 'app-lugares-dialog',
  templateUrl: './lugares-dialog.component.html',
  styleUrls: ['./lugares-dialog.component.css']
})
export class LugaresDialogComponent {
  private backupSites: Partial<Sites> = { ...this.data.site };

  constructor(
    public dialogRef: MatDialogRef<LugaresDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SitesDialogData
  ) {}


  validarFormulario(): boolean {
    return !!(
      this.data.site &&
      this.data.site.name &&
      this.data.site.coorLat &&
      this.data.site.coorLon
    );
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