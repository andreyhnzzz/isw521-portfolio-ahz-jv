# Bitácora de depuración

> Sustituye cada marcador de captura por una imagen real tomada en tu navegador. No inventes evidencia.

## Incidencia 1 — Conversación en el almacenamiento incorrecto

### Código original incorrecto

```js
function cargarConversacion() {
  const c = localStorage.getItem("conversacion");
  return c ? JSON.parse(c) : [];
}
function guardarConversacion(conv) {
  localStorage.setItem("conversacion", JSON.stringify(conv));
}
```

### Detección con DevTools

En **Application → Local Storage** apareció `conversacion`, aunque el requisito indica que debe vivir en Session Storage.

**Captura:** `evidencias/01-conversacion-en-localstorage.png`

### Intervención

Se creó `SessionConversationRepository`, que recibe `window.sessionStorage` e interactúa solo con la clave `conversacion`.

### Por qué funciona

El ciclo de vida queda asociado a la sesión de navegación de la pestaña y deja de sobrevivir al cierre completo del navegador.

---

## Incidencia 2 — Favoritos en el almacenamiento incorrecto

### Código original incorrecto

```js
function cargarFavoritos() {
  const f = sessionStorage.getItem("favoritos");
  return f ? JSON.parse(f) : [];
}
```

### Detección con DevTools

En **Application → Session Storage** apareció `favoritos`. Después de cerrar la sesión del navegador, los datos no cumplían la persistencia requerida.

**Captura:** `evidencias/02-favoritos-en-sessionstorage.png`

### Intervención

Se implementó `LocalFavoriteRepository` sobre `window.localStorage`.

### Por qué funciona

`localStorage` conserva la biblioteca hasta que el usuario o la aplicación la eliminen explícitamente.

---

## Incidencia 3 — Formato de historial inválido

### Código original incorrecto

```js
conv.push(texto);
const data = await ApiLLM.enviar(conv);
conv.push(data.respuesta);
```

### Detección con DevTools

Se colocó un breakpoint antes de `ApiLLM.enviar` y se inspeccionó `conv`: era un arreglo de strings. El contrato esperaba objetos y la promesa rechazó con status 422.

**Capturas:**

- `evidencias/03-breakpoint-historial-strings.png`
- `evidencias/04-error-422-contexto.png`

### Intervención

El dominio ahora crea mensajes:

```js
{ rol: "user", contenido: "..." }
{ rol: "ia", contenido: "..." }
```

El gateway convierte el historial a un DTO exacto antes de llamar la API.

### Por qué funciona

Cada elemento satisface `_contextoValido()` y la implementación ya no depende de propiedades de UI o infraestructura.

---

## Incidencia 4 — Cookie con nombre y formato incorrectos

### Código original incorrecto

```js
const token = Math.random().toString(36).slice(2);
document.cookie = "token=" + token;
```

### Detección con DevTools

En **Application → Cookies** se observó una cookie llamada `token`, sin el prefijo ni el epoch exigidos. `ApiLLM` respondió 401.

**Captura:** `evidencias/05-cookie-incorrecta.png`

### Intervención

Se creó `CookieTokenAdapter` con:

```text
llm_token=tk_<Date.now()+120000>; Max-Age=120; Path=/; SameSite=Lax
```

### Por qué funciona

Coincide con el nombre, regex y comparación temporal de la API congelada.

---

## Incidencia 5 — Token sin expiración de dos minutos

### Código original incorrecto

La cookie no incluía `Max-Age` ni una fecha de expiración.

### Detección con DevTools

En **Application → Cookies → Expires/Max-Age** la cookie aparecía como de sesión, no como token de 120 segundos.

**Captura:** `evidencias/06-cookie-expiracion.png`

### Intervención

El adaptador calcula el epoch futuro y establece `Max-Age=120` y `Expires` equivalente.

### Por qué funciona

La API valida el epoch embebido y el navegador elimina la cookie al finalizar el TTL.

---

## Incidencia 6 — Eliminación destructiva al recibir 401

### Código original incorrecto

```js
if (e.status === "401") {
  localStorage.clear();
  $("modal").classList.add("visible");
}
```

### Detección con DevTools

Tras provocar el 401, **Application → Local Storage** perdió también `favoritos`.

**Capturas:**

- `evidencias/07-antes-401-almacenamientos.png`
- `evidencias/08-despues-401-favoritos-perdidos.png`

### Intervención

`ChatService` ejecuta únicamente `conversationRepository.clear()`, que elimina `sessionStorage.conversacion`.

### Por qué funciona

La responsabilidad de limpiar el hilo se limita al repositorio de conversación; no existe acceso a `localStorage` dentro del caso de uso.

---

## Incidencia 7 — Badge sin cuenta regresiva real

### Código original incorrecto

```js
$("badgeToken").textContent = "🍪 Sesión activa";
```

### Detección con DevTools

El texto permanecía fijo y no reflejaba el epoch almacenado en la cookie.

**Captura:** `evidencias/09-badge-estatico.png`

### Intervención

`SessionService.getStatus()` calcula `expiresAt - Date.now()` y el controlador actualiza la vista cada 250 ms.

### Por qué funciona

La UI deriva el tiempo del mismo valor que valida la API; no mantiene un contador independiente que pueda desincronizarse.

---

## Incidencia 8 — Mezcla de responsabilidades

### Código original incorrecto

La misma función leía inputs, mutaba storage, llamaba la API, manejaba errores y pintaba DOM.

### Detección

Durante el breakpoint fue necesario recorrer múltiples efectos laterales dentro de `enviarPrompt()`, dificultando aislar la causa.

**Captura:** `evidencias/10-call-stack-borrador.png`

### Intervención

Se separaron dominio, servicios, puertos, adaptadores, vista, controlador y composición.

### Por qué funciona

Cada componente puede inspeccionarse y probarse de forma independiente; sustituir el simulador no requiere reescribir UI ni persistencia.

---

## Incidencia 9 — Aclaración sobre Network

El simulador proporcionado no usa `fetch` ni XHR; su 401 es un rechazo de promesa, por lo que puede no aparecer como solicitud en Network.

### Evidencia válida con esta versión

- breakpoint dentro de `ApiLLM.enviar`;
- error 401 capturado en el flujo;
- cookie expirada/ausente en Application;
- modal visible;
- `sessionStorage.conversacion` eliminada;
- `localStorage.favoritos` intacto.

**Captura:** `evidencias/11-estado-final-401.png`

Si la versión del profesor usa una API HTTP real, añade también `evidencias/12-network-401.png`.
