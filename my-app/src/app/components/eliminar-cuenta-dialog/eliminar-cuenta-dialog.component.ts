import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VehicleDialogData } from '../vehiculos-dialog/vehiculos-dialog.component';

@Component({
  selector: 'app-eliminar-cuenta-dialog',
  templateUrl: './eliminar-cuenta-dialog.component.html',
  styleUrls: ['./eliminar-cuenta-dialog.component.css']
})
export class EliminarCuentaDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<EliminarCuentaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public borrarCuenta: boolean 
    ){this.borrarCuenta = false;}

  removeAccount(): void {
    this.borrarCuenta = true;
    this.dialogRef.close(this.borrarCuenta);
  }
}
