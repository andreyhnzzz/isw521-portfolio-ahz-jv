Actividad 1
1) setTimeout(() => console.log('hola'), 1000);
(a) Tipo de API: Es una Web API del navegador (específicamente de la Timers API asociada al objeto window). No es una API de Emscripten.
(b) En Node.js: El código se ejecutaría correctamente y mostraría el mensaje tras 1 segundo. Aunque Node.js no es un navegador, implementa los Timers (setTimeout, setInterval) en su ámbito global para mantener la compatibilidad con el estándar de JavaScript.
2) const arr = [1, 2, 3].map(x => x * 2);
(a) Tipo de API: Ninguna de las dos. Esto es JavaScript puro (ECMAScript). Específicamente, es el uso del método nativo Array.prototype.map del lenguaje.
(b) En Node.js: Funcionaría perfectamente. Node.js ejecuta el motor V8 (o similar), que implementa el estándar ECMAScript, por lo que los métodos de los objetos nativos de JS funcionan igual que en el navegador.
3) console.log(navigator.onLine);
(a) Tipo de API: Es una Web API del navegador. Pertenece al objeto window.navigator que expone información sobre el estado y capacidades del navegador.
(b) En Node.js: Lanzaría un error (ReferenceError: navigator is not defined). Node.js no tiene un objeto navigator nativo porque no es un entorno de navegador y no tiene concepto de "conexión de red del usuario" de la misma forma que lo expone el DOM.
Tema 2. Actividad
Dado un <ul id="lista"> con tres <li> (cada uno con un botón):
(a) Selección con querySelectorAll:
const segundoLi = document.querySelectorAll('#lista li')[1];
(Nota: querySelectorAll devuelve una NodeList, por lo que accedemos al segundo elemento usando el índice [1], ya que los arrays empiezan en 0).
(b) Selección por recorrido relativo (traversal) desde el primer <li>:
const primerLi = document.querySelector('#lista li'); // o document.getElementById('lista').firstElementChild;
const segundoLi = primerLi.nextElementSibling;
Cuál seguiría funcionando si alguien agrega un cuarto <li> al inicio de la lista?
Si tu objetivo es seleccionar el segundo elemento actual de la lista (es decir, el que ahora ocupa la posición 2 tras la inserción), ambas formas seguirían funcionando.
Sin embargo, si tu objetivo era seleccionar el <li> original que era el segundo (el que antes de insertar el nuevo estaba en la posición 2), ninguna de las dos formas funcionaría. Al insertar un elemento al principio, los índices cambian y los hermanos relativos cambian.
Conclusión: Para que la selección sea robusta e inmune a cambios de orden en el DOM, no deberías basarte en índices ni en posiciones relativas, sino en un identificador único (como un id específico o un atributo data-* en ese <li> concreto).
Actividad 3
1) Riesgo de seguridad específico:
El riesgo es Cross-Site Scripting (XSS), específicamente DOM-based XSS. Al concatenar directamente una entrada de usuario sin sanitizar dentro de innerHTML, si nombreUsuario contiene algo como <script>robarCookies()</script> o <img src=x onerror=alert(1)>, el navegador lo interpretará como código HTML/JS válido y lo ejecutará, comprometiendo la seguridad de la aplicación y del usuario.
2) Corrección del código:
Para evitar XSS, nunca se debe usar innerHTML con datos no confiables. La forma correcta es usar textContent (que escapa automáticamente cualquier etiqueta HTML) o crear los nodos mediante el DOM API.
// Opción recomendada usando creación de nodos:
const nuevoH3 = document.createElement('h3');
nuevoH3.textContent = nombreUsuario; // textContent trata todo como texto plano, no como HTML.
perfilDiv.appendChild(nuevoH3);
 Uso de classList para marcar el campo como inválido:
Si detectas que la entrada es sospechosa (por ejemplo, mediante una expresión regular que detecta etiquetas HTML o caracteres peligrosos), puedes usar la propiedad classList del elemento <input> para añadir una clase CSS que lo marque visualmente como error.
 Uso de classList para marcar el campo como inválido:
Si detectas que la entrada es sospechosa (por ejemplo, mediante una expresión regular que detecta etiquetas HTML o caracteres peligrosos), puedes usar la propiedad classList del elemento <input> para añadir una clase CSS que lo marque visualmente como error.
Luego, en tu archivo CSS, definirías el estilo visual para esa clase:
.invalido {
    border: 2px solid red;
    background-color: #ffe6e6;
    color: darkred;
}