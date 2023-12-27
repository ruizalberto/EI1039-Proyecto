import { Mobility } from "./mobility.interface";


export class Foot implements Mobility {
    nombre: string;
    marca: string;
    tipo: string; 
    consumo: number; //consumo en litros por 100 km´s "consumption"
    perfil: string; //profile "driving-car" / "cycling-regular" / "foot-walking"

    constructor(name: string){
        this.nombre= name;
        this.marca= "";
        this.tipo= "";
        this.consumo= 75; // consumo por kilometro
        this.perfil= "foot-walking";  
    }

    getPerfil(): string {
        return this.perfil;
    }
}

//En promedio, se estima que una persona quema aproximadamente 50-100 calorías por cada kilómetro caminado