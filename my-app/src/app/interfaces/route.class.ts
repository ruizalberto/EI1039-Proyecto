import { Favorite } from "./favorite.decorator";

export class Route {
    nombre: string;
    inicio: string;
    final: string;
    trayecto: any;
    distancia: string;
    duracion: number;

    @Favorite()
    favorite:boolean;

    constructor(nombre: string, inicio: string, final: string, trayecto: any, distancia: string, duracion: number){
        this.nombre = nombre;
        this.inicio = inicio;
        this.final = final;
        this.trayecto = trayecto;
        this.distancia = distancia;
        this.duracion = duracion;
        this.favorite = false;
    }
 }