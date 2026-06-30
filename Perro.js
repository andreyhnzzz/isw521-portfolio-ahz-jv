import { Animal } from "./Animal.js";

export class Perro extends Animal {
    constructor(nombre, raza, edad) {
        super(nombre, "Perro", raza, edad);
    }

    ladrar() {
        console.log(this.nombre + " dice: Woof!");
    }
}
