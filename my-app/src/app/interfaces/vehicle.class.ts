import { Mobility } from "./mobility.interface";


export class Vehiculo implements Mobility{
    private id?:string;
    nombre: string;
    marca: string;
    tipo: string; //electrico o gasolina
    consumo: number; //consumo en litros por 100 km´s "consumption"
    perfil: string;//profile "driving-car" / "cycling-regular" / "foot-walking"


    constructor(name: string, marca: string, tipo: string, consumo: number){
        this.nombre= name;
        this.marca= marca;
        this.tipo=tipo;
        this.consumo= consumo;
        this.perfil= "driving-car";  
    }

    getId(): string|undefined{return this.id;}

}