import { Mobility } from 'src/app/interfaces/mobility.interface';
import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
  })
export class MobilityService{
    private mobilitySelected!: Mobility;
    private isSelected: boolean;
    mobilitySubject: BehaviorSubject<Mobility[]> = new BehaviorSubject<Mobility[]>([]);
    mobilityData$ = this.mobilitySubject.asObservable();

    constructor(){
        this.isSelected = false;
    }

    setMobilySelected(mobility: Mobility){
        console.log(mobility.nombre);
        console.log(mobility.marca);
        console.log(mobility.consumo);
        console.log(mobility.tipo);
        this.mobilitySelected = mobility;
        this.isSelected = true;
        this.updateMobilitySubject();
    }

    getMobilitySelected(): Mobility {
        return this.mobilitySelected;
    }

    setIsMobilitySelected(boolean: boolean): void {
        this.isSelected = boolean;
    }

    isMobilitySelected(): boolean {
        return this.isSelected;
    }

    updateMobilitySubject():void{
        const mobilityData = [this.mobilitySelected];
        this.mobilitySubject.next(mobilityData);
    }
}