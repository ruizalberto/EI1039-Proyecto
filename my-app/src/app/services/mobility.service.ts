import { Mobility } from 'src/app/interfaces/mobility.interface';
import { Injectable } from '@angular/core'

@Injectable({
    providedIn: 'root',
  })
export class MobilityService{
    private mobilitySelected!: Mobility;
    private isSelected: boolean;

    constructor(){
        this.isSelected = false;
    }

    setMobilySelected(mobility: Mobility){
        this.mobilitySelected = mobility;
        this.isSelected = true;
    }
    getMobilitySelected():Mobility{
        return this.mobilitySelected;
    }
    isMobilitySelected():boolean{
        return this.isSelected;
    }

}