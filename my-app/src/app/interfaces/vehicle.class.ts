import { Favorite } from "./favorite.decorator";
import { Mobility } from "./mobility.interface";

export class Vehiculo implements Mobility {
    nombre: string;
    marca: string;
    tipo: string;
    consumo: number;
    perfil: string;

    @Favorite()
    favorite:boolean;

    constructor(name: string, marca: string, tipo: string, consumo: number){
        this.nombre = name;
        this.marca = marca;
        this.tipo = tipo;
        this.consumo = consumo;
        this.perfil= "driving-car";
        this.favorite=false;
    }

    getPerfil(): string {
        return this.perfil;
    }
}