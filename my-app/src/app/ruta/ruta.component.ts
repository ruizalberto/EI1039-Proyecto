import { Component, OnInit } from '@angular/core';
import { OpenRouteService } from '../openrouteservice.service';

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.component.html',
  styleUrls: ['./ruta.component.css']
})
export class RutaComponent implements OnInit{  
  ruta: any;

  constructor(private openRouteService: OpenRouteService) { }

  ngOnInit(): void {
    const start = '8.681495,49.41461';
    const end = '8.687872,49.420318';

    this.openRouteService.getDirections(start, end).subscribe(response => {
      this.ruta = JSON.stringify(response, null, 2);
    });
  }
}
