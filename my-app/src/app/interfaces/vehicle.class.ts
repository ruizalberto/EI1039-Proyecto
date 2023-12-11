import { Mobility } from "./mobility.interface";

export class Vehiculo implements Mobility {
    private id?:string;
    nombre: string;
    marca: string;
    tipo: string; //Electrico o Gasolina ( por defecto es gasolina )
    consumo: number; //consumo en litros por 100 km´s "consumption"
    perfil: string;//profile "driving-car" / "cycling-regular" / "foot-walking"


    constructor(name: string, marca: string, tipo: string, consumo: number){
        if(name != undefined)
            this.nombre= name;
        else
            this.nombre="-";
        if(marca != undefined)
            this.marca= marca;
        else
            this.marca = "-";
        if(tipo != undefined)
            this.tipo = tipo;
        else
            this.tipo= "Gasolina";
        if(consumo != undefined)
            this.consumo= consumo;
        else
            this.consumo = 0;

        this.perfil= "driving-car";
    }

    getPerfil(): string {
        return this.perfil;
    }

    getId(): string|undefined{return this.id;}
    setId(id: string){ this.id=id; }
}