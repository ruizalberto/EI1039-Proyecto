import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { HttpClientModule } from '@angular/common/http';
import { MarkerService } from './services/marker.service';
import { OpenRouteService } from './services/openrouteservice.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { NavbarComponent } from './components/navbar/navbar.component';
import { VehiculosComponent } from './components/vehiculos/vehiculos.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavbarComponent,
    VehiculosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp({"projectId":"ei1039-proyecto","appId":"1:179739788323:web:eb7516375f3164d3391d96","storageBucket":"ei1039-proyecto.appspot.com","apiKey":"AIzaSyBA3ddHIlCvJkpcUK_b_arObp36f1hQEGQ","authDomain":"ei1039-proyecto.firebaseapp.com","messagingSenderId":"179739788323"})),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase())
  ],
  providers: [
    MarkerService,
    OpenRouteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
