import { Animal } from "./Animal.js";
import { Perro } from "./Perro.js";

// Crear un animal generico
let gato = new Animal("Michi", "Gato", "Siames", 4);
gato.describir();

console.log("---");

// Crear un perro
let perro = new Perro("Rex", "Labrador", 2);
perro.describir();
perro.ladrar();
