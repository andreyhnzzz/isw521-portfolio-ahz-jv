# Resumen ejecutivo

## Propósito

La práctica evalúa la capacidad de asignar correctamente tres estados del navegador según su ciclo de vida: conversación temporal por pestaña, biblioteca persistente y token temporal. El reto central no es visual; es evitar que `sessionStorage`, `localStorage` y cookies se mezclen o se eliminen entre sí.

## Diagnóstico del borrador

El código inicial compila y luce funcional, pero incumple los requisitos críticos:

- Guarda la conversación en `localStorage` y los favoritos en `sessionStorage`: están invertidos.
- Envía strings a `ApiLLM`, aunque el contrato exige objetos `{ rol, contenido }`; produce `422`.
- Crea una cookie llamada `token`, con valor aleatorio, sin formato ni expiración; la API exige `llm_token=tk_<epochMsExpiracion>`.
- Ante `401` ejecuta `localStorage.clear()`, destruyendo los favoritos que debe conservar.
- El badge no muestra una cuenta regresiva real.
- Mezcla dominio, almacenamiento, API y UI en un único bloque, elevando el acoplamiento.

## Solución implementada

Se aplicó una arquitectura hexagonal pragmática:

- **Dominio:** valida mensajes y prompts favoritos.
- **Aplicación:** orquesta envío, favoritos y sesión sin depender del navegador.
- **Puertos:** contratos para repositorios, token y gateway LLM.
- **Adaptadores:** `sessionStorage`, `localStorage`, cookies, `ApiLLM` y DOM.
- **Controlador:** coordina eventos de UI y casos de uso.

La API congelada permanece intacta y se inyecta al adaptador de red desde `bootstrap.js`.

## Resultado

La aplicación cumple el contrato funcional, mejora la mantenibilidad y ofrece una interfaz moderna, responsive y accesible. El ZIP incluye además la bitácora obligatoria preestructurada, guía exacta de evidencia en DevTools, pruebas automatizadas y checklist de entrega.

## Riesgos detectados en el enunciado

- Algunos navegadores clonan inicialmente `sessionStorage` al duplicar una pestaña. La solución respeta la instrucción académica de usar el comportamiento natural, sin hacks adicionales. Conviene validar el navegador exacto del profesor.
- El simulador entregado no ejecuta una solicitud HTTP real; por tanto, su `401` puede no aparecer como una entrada en Network. Se evidencia mediante breakpoint/Console. Si la versión del profesor usa `fetch`, entonces sí aparecerá en Network.
