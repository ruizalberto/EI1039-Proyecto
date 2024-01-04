import { Component, OnInit, isDevMode } from "@angular/core";
import { Subscription } from "rxjs";
import { Bike } from "src/app/interfaces/bike.class";
import { Foot } from "src/app/interfaces/foot.class";
import { Mobility } from "src/app/interfaces/mobility.interface";
import { Vehiculo } from "src/app/interfaces/vehicle.class";
import { DefaultService } from "src/app/services/default.service";
import { UserService } from "src/app/services/user.service";
import { VehiculosService } from "src/app/services/vehiculos.service";

@Component({
    selector: 'app-map',
    templateUrl: './default.component.html',
    styleUrls: ['./default.component.css']
})
  
export class DefaultComponent implements OnInit { 
    vehiclesData: Vehiculo[] = [];
    vehiclesSubscription!: Subscription;
    userSubscription!: Subscription;
    userID: any;
    panelOpenState = false;

    typeDefault:string = "";
    defaultSubscription!: Subscription
    mobilityDefault: Mobility;

    constructor(private vehiculosService: VehiculosService, private userService: UserService, private defaultService: DefaultService){
        this.mobilityDefault = new Vehiculo("","","",0)
    }

    ngOnInit(): void {
        this.initUserSubscription();
    }

    private initUserSubscription() {
        this.userSubscription = this.userService.getInfoUserLogged().subscribe(user => {
          if (user){
            this.userID = user.uid;
            this.initVehiclesSubscription();
            this.initDefaultData();
          } else {
            if (this.defaultSubscription) {
                this.defaultSubscription.unsubscribe();
            }

            if (this.vehiclesSubscription) {
                this.vehiclesData = [];
                this.vehiclesSubscription.unsubscribe();
            }
          }
        });
    }
    //---------------- rellena la lista de vehiculos ---------------------------------
    private initVehiclesSubscription() {
        this.vehiclesSubscription = this.vehiculosService.getVehicles(this.userID).subscribe( vehicles => {
            this.orderListVehiclesFav(vehicles);
        });
    }
    orderListVehiclesFav(vehiculos: Vehiculo[]){
        this.vehiclesData = vehiculos.sort((a,b) => (b.favorite ? 1 : 0 - (a.favorite ? 1 : 0)));
    }
    //--------------------------------------------------------------------------------
    //----------------- rellena datos por defecto iniciales --------------------------
    private initDefaultData(){
        this.defaultSubscription = this.defaultService.getDefault(this.userID).subscribe( defaultRef =>{
            if(defaultRef[0] != undefined){
                if(defaultRef[0].nombreMobility == "A pie"){
                    this.mobilityDefault = new Foot("A pie");
                    this.typeDefault = defaultRef[0].estrategiaRoute;
                }
                else if(defaultRef[0].nombreMobility == "Bicicleta"){
                    this.mobilityDefault = new Bike("Bicicleta", "Carretera");
                    this.typeDefault = defaultRef[0].estrategiaRoute;
                }
                else{
                    this.mobilityDefault = new Vehiculo(defaultRef[0].nombreMobility,
                                                        defaultRef[0].marcaMobility,
                                                        defaultRef[0].tipoMobility,
                                                        defaultRef[0].consumoMobility);
                }
                this.typeDefault = defaultRef[0].estrategiaRoute;
            } else {
                this.defaultService.addDefaultToUserCollection(this.userID,new Bike("Bicicleta", "Bicicleta"),"type_3")
            }
        });
    }
    //--------------------------------------------------------------------------------
    //------------------- Cambia el vehiculo por defecto -----------------------------
    selectedVehicle(vehicle: Mobility) {
        this.mobilityDefault = vehicle;
        this.defaultService.modifyVehicleDefault(this.userID,this.mobilityDefault);
        this.panelOpenState = false;

    }
    selectedFoot(){
        this.mobilityDefault = new Foot("A pie");
        this.defaultService.modifyVehicleDefault(this.userID,this.mobilityDefault);
        this.panelOpenState = false;
    }
    selectedCicle(){
        this.mobilityDefault = new Bike("Bicicleta", "Carretera");
        this.defaultService.modifyVehicleDefault(this.userID,this.mobilityDefault);
        this.panelOpenState = false;
    }
    //--------------------------------------------------------------------------------
    //--------------------------------------------------------------------------------
    onRadioChange(event: any){
        this.defaultService.modifyTypeDefault(this.userID, event.target.value)
        this.typeDefault = event.target.value
    }
    //--------------------------------------------------------------------------------
    //---------------------- Restablece el valor por defecto -------------------------
    removeMobilityDefault(){
        this.selectedCicle(); 
    }
    removeTipeDefault(){
        this.defaultService.modifyTypeDefault(this.userID, "type_3");
        this.typeDefault = "type_3";
    }    
}
