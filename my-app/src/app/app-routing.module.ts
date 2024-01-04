import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiculosComponent } from './components/vehiculos/vehiculos.component';
import { MapComponent } from './components/map/map.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { AuthguardService } from './services/authguard.service';
import { LugaresComponent } from './components/lugares/lugares.component';
import { RutasComponent } from './components/rutas/rutas.component';
import { DefaultComponent } from './components/default/default.component';


const routes: Routes = [
  { path: '', redirectTo:'home', pathMatch: "full"},
  { path: 'home', component: MapComponent},
  { path: 'vehiculos', component: VehiculosComponent, canActivate: [AuthguardService]},
  { path: 'lugares', component: LugaresComponent, canActivate:[AuthguardService]},
  { path: 'rutas', component: RutasComponent, canActivate:[AuthguardService]},
  { path: 'default', component: DefaultComponent, canActivate:[AuthguardService]},
  { path: 'registro', component: RegistroComponent},
  { path: 'login', component: LoginComponent},
  { path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }