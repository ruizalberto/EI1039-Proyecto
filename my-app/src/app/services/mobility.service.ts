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
        this.mobilitySelected = mobility;
        this.isSelected = true;
        this.updateMobilitySubject();
    }

    getMobilitySelected():Mobility{
        return this.mobilitySelected;
    }

    isMobilitySelected():boolean{
        return this.isSelected;
    }

    updateMobilitySubject():void{
        const mobilityData = [this.mobilitySelected];
        this.mobilitySubject.next(mobilityData);
    }
}