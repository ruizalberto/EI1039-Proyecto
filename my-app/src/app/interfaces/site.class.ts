import { Favorite } from "./favorite.decorator";

export class Sites {
   name: string;
   coorLat: number;
   coorLon: number;

   @Favorite()
   favorite:boolean;
   
   constructor(name: string, coorLat: number, coorLon: number){
      this.name = name;
      this.coorLat = coorLat;
      this.coorLon = coorLon;
      this.favorite = false;
   }
}