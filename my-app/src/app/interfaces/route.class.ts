export class Route {
    nombre: string;
    inicio: string;
    final: string;
    trayecto: any;
    distancia: string;
    duracion: number;

    constructor(nombre: string, inicio: string, final: string, trayecto: any, distancia: string, duracion: number){
        this.nombre = nombre;
        this.inicio = inicio;
        this.final = final;
        this.trayecto = trayecto;
        this.distancia = distancia;
        this.duracion = duracion;
    }
 }