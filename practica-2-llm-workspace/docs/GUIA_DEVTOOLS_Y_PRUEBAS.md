# Guía de DevTools y pruebas

## Preparación

1. Ejecuta el servidor local.
2. Abre `http://localhost:5500`.
3. Abre DevTools con `F12`.
4. Mantén visibles **Application**, **Sources**, **Console** y **Network**.

## Prueba 1 — Estado simultáneo

1. Inicia sesión.
2. Envía un prompt.
3. Guarda otro prompt como favorito.
4. En Application verifica:
   - Session Storage → `conversacion`.
   - Local Storage → `favoritos`.
   - Cookies → `llm_token`.
5. Captura la pantalla con las tres evidencias.

## Prueba 2 — Contrato del historial

1. En Sources abre `src/adapters/api/ApiLlmGateway.js`.
2. Coloca breakpoint en `return this.apiLLM.enviar(contextDto);`.
3. Envía un prompt.
4. Inspecciona `contextDto`.
5. Confirma que todos los elementos tienen únicamente `rol` y `contenido`.

## Prueba 3 — Favoritos persistentes

1. Guarda al menos dos favoritos.
2. Cierra el navegador completamente.
3. Reabre el servidor y la página.
4. Confirma que los favoritos siguen visibles.
5. Verifica `localStorage.favoritos`.

## Prueba 4 — Conversación temporal

1. Envía mensajes.
2. Cierra el navegador completamente.
3. Reabre la página.
4. Confirma que no existe la conversación anterior.

> Valida también el comportamiento de “Duplicar pestaña” en el navegador de evaluación. Algunos navegadores copian el estado inicial de `sessionStorage` al duplicar; es una particularidad de plataforma, no de la elección del almacenamiento.

## Prueba 5 — Expiración 401

1. Inicia sesión.
2. Confirma que el badge comienza cerca de `02:00`.
3. Guarda un favorito.
4. Envía un mensaje.
5. Espera hasta `00:00`.
6. Intenta enviar otro mensaje.
7. Verifica:
   - aparece el modal 401;
   - desaparece `sessionStorage.conversacion`;
   - permanece `localStorage.favoritos`;
   - la cookie está expirada o ausente.

## Prueba 6 — 422 controlado

La UI normal no debe producir 422. Para demostrar que el contrato evita el error, compara el DTO actual con el arreglo de strings del borrador. No alteres el código final solo para generar una falla durante la entrega.

## Pruebas automatizadas

```bash
npm test
```

Deben finalizar sin fallos.
