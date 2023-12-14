import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BasicDataBox } from './components/basic-data-box/basic-data-box.component';
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
import { VehiculosDialogComponent } from './components/vehiculos-dialog/vehiculos-dialog.component';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavbarComponent,
    VehiculosComponent,
    VehiculosDialogComponent,
    BasicDataBox
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    MatDialogModule,
    AppRoutingModule,
    HttpClientModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp({"projectId":"ei1039-proyecto","appId":"1:179739788323:web:eb7516375f3164d3391d96","databaseURL":"https://ei1039-proyecto-default-rtdb.europe-west1.firebasedatabase.app","storageBucket":"ei1039-proyecto.appspot.com","apiKey":"AIzaSyBA3ddHIlCvJkpcUK_b_arObp36f1hQEGQ","authDomain":"ei1039-proyecto.firebaseapp.com","messagingSenderId":"179739788323"})),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
  ],
  exports: [
    BasicDataBox
  ],

  providers: [
    MarkerService,
    OpenRouteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
