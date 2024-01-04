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
  ) { }

  validarFormulario(): boolean {
    const consumoValido = this.data.vehicle &&
        this.data.vehicle.nombre &&
        this.data.vehicle.marca &&
        this.data.vehicle.tipo &&
        this.data.vehicle.consumo !== undefined &&
        this.data.vehicle.consumo > 0 && this.data.vehicle.consumo <= 50;

    return !!consumoValido;
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