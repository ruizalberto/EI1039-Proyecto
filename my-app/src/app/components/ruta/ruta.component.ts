import { Component, OnInit, OnDestroy } from '@angular/core';
import { OpenRouteService } from '../../services/openrouteservice.service';
import { MarkerService } from 'src/app/services/marker.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.component.html',
  styleUrls: ['./ruta.component.css'],
  providers: [OpenRouteService, MarkerService]
})
export class RutaComponent implements OnInit{  
  ruta: any;
  private unsucribe$ = new Subject<void>();

  constructor(
    private openRouteService: OpenRouteService,
    private markerService: MarkerService
  ) { }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.unsucribe$.next();
    this.unsucribe$.complete();
  }

  calcularRuta(): void {
    this.markerService.getMarkers()
      .pipe(takeUntil(this.unsucribe$))
      .subscribe(markerPositions => {
        console.log("Posiciones del marker:", markerPositions.length);
        if (markerPositions.length == 2) {
          const start = markerPositions[0];
          const end = markerPositions[1];

          this.openRouteService.getDirections(start, end).subscribe(
            response => {
              this.ruta = JSON.stringify(response, null, 2);
            },
            error => {
              console.log('Error al obtener direcciones:', error);
            }
          );
        }
      });
  }

}
