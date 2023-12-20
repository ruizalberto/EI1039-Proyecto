export class Sites {
   name: string;
   coorLat: number;
   coorLon: number;
   
   constructor(name: string, coorLat: number, coorLon: number){
      this.name = name;
      this.coorLat = coorLat;
      this.coorLon = coorLon;
   }
}