
export interface Mobility{
    nombre: string;
    marca: string;
    tipo: string; //
    consumo: number; //consumo en litros por 100 km´s "consumption"
    perfil: string;

    getPerfil(): string;
}
// distintos posibles perfiles
// -----------------------------
// driving-car -> vehiculo normal
// driving-hgv -> vehiculo pesado
// cycling-regular -> bicicleta normal
// cycling-road -> bicicleta carretera
// cycling-montain -> bicicleta de montaña
// cycling-electric -> bicicleta electrica
// foot-walking -> caminando a pie
// foot-hiking -> senderismo
// wheelchair -> silla de ruedas