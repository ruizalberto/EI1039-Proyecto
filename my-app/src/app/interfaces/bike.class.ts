import { Mobility } from "./mobility.interface";


export class Bike implements Mobility{
    nombre: string;
    marca: string;
    tipo: string; 
    consumo: number; //consumo en litros por 100 km´s "consumption"
    perfil: string; //profile "driving-car" / "cycling-regular" / "foot-walking"

    constructor(name: string, marca: string){
        this.nombre= name;
        this.marca= marca;
        this.tipo= "";
        this.consumo= 45; // consumo por kilometro
        this.perfil= "cycling-regular";  
    }

    getPerfil(): string {
        return this.perfil;
    }
}

//En general, se puede decir que un ciclista promedio que va a una velocidad moderada de unos 16 km/h quemará 
//alrededor de 40-50 calorías por kilómetro recorrido. Por lo tanto, si recorres 1 km en bicicleta a una velocidad 
//moderada, es probable que quemes alrededor de 40-50 calorías.