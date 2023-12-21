import { Mobility } from "./mobility.interface";
import { Sites } from "./site.class";

export class Route {
    transport: Mobility;
    start: Sites;
    end: Sites;
    preference: string;
    distance: number; // kilometros
    duration: number; // minutos
    cost: number; // calorias o euros
    constructor(transport: Mobility, start: Sites, end: Sites, preference: string, distance: number, duration: number, cost:number){
        this.transport = transport;
        this.start = start;
        this.end = end;
        this.preference = preference;
        this.distance = distance;
        this.duration = duration;
        this.cost = cost;
       }
 }