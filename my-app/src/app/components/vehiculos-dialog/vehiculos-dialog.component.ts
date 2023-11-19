import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Mobility } from 'src/app/interfaces/mobility.interface';

@Component({
  selector: 'app-vehiculos-dialog',
  templateUrl: './vehiculos-dialog.component.html',
  styleUrls: ['./vehiculos-dialog.component.css']
})
export class VehiculosDialogComponent {
  private backupVehicle: Partial<Mobility> = { ...this.data.vehicle };

  constructor(
    public dialogRef: MatDialogRef<VehiculosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VehicleDialogData
  ) {}

  cancel(): void {
    this.data.vehicle.nombre = this.backupVehicle.nombre;
    this.data.vehicle.marca = this.backupVehicle.marca;
    this.data.vehicle.tipo = this.backupVehicle.tipo;
    this.data.vehicle.consumo = this.backupVehicle.consumo;
    this.dialogRef.close(this.data);
  }
}

export interface VehicleDialogData {
  vehicle: Partial<Mobility>;
  enableDelete: boolean;
}

export interface VehiculosDialogResult {
  vehicle: Mobility;
  delete?: boolean;
}