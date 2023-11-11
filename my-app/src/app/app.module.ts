import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { RutaComponent } from './components/ruta/ruta.component';
import { HttpClientModule } from '@angular/common/http';
import { MarkerService } from './services/marker.service';
import { OpenRouteService } from './services/openrouteservice.service';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    RutaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    MarkerService,
    OpenRouteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
