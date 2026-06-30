export class Animal {
    constructor(nombre, tipo, raza, edad) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.raza = raza;
        this.edad = edad;
    }

    describir() {
        console.log("Nombre: " + this.nombre);
        console.log("Tipo: " + this.tipo);
        console.log("Raza: " + this.raza);
        console.log("Edad: " + this.edad + " años");
    }
}
