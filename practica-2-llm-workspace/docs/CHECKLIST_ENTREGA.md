# Checklist de entrega

## Funcionalidad

- [ ] `sessionStorage` contiene `conversacion`.
- [ ] Cada mensaje tiene `rol` y `contenido`.
- [ ] `localStorage` contiene `favoritos`.
- [ ] Favoritos sobreviven al reinicio del navegador.
- [ ] Cookie se llama `llm_token`.
- [ ] Valor inicia con `tk_` y termina en epoch milisegundos.
- [ ] Cookie usa `Max-Age=120`.
- [ ] Badge muestra cuenta regresiva real.
- [ ] Sin token válido ocurre 401.
- [ ] El modal aparece tras 401.
- [ ] La conversación se elimina tras 401.
- [ ] Los favoritos permanecen tras 401.
- [ ] `ApiLLM` no fue modificada.

## Evidencia

- [ ] Captura de Session Storage.
- [ ] Captura de Local Storage.
- [ ] Captura de Cookie y expiración.
- [ ] Captura de DTO en breakpoint.
- [ ] Captura de modal 401.
- [ ] Captura final con conversación eliminada y favoritos intactos.
- [ ] Captura Network 401 solo si la versión usada hace una petición HTTP real.

## Calidad

- [ ] `npm test` pasa.
- [ ] No hay errores en Console al arrancar.
- [ ] UI funciona en ancho móvil.
- [ ] Enter envía y Shift+Enter inserta línea.
- [ ] Navegación con teclado y foco visible.
- [ ] Bitácora contiene fragmento original, detección, intervención y explicación.
- [ ] La aplicación se ejecuta desde `http://localhost`, no `file://`.

## Entrega sugerida

- [ ] Carpeta del proyecto completa.
- [ ] Bitácora exportada al formato solicitado por el profesor, con capturas reales.
- [ ] ZIP final probado después de descomprimirlo.
