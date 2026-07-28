# Prompt maestro de desarrollo

Copia el bloque completo en Claude Code, Codex u otro agente con acceso al repositorio.

---

## PROMPT

Actúa como arquitecto de software senior y desarrollador frontend especializado en JavaScript nativo, Web Storage, cookies, accesibilidad y diseño de interfaces modernas.

Debes auditar y reconstruir profesionalmente una práctica llamada **“Memoria de Contexto del LLM — Prompt Engineer Workspace”**. Trabaja por fases verificables y no alteres el simulador `ApiLLM` bajo ninguna circunstancia.

### Objetivo funcional

Construir una aplicación estática donde:

1. La conversación actual se almacene en `sessionStorage` bajo la clave `conversacion`.
2. Los prompts favoritos se almacenen en `localStorage` bajo la clave `favoritos`.
3. El botón de sesión cree una cookie exactamente así:
   - Nombre: `llm_token`.
   - Valor: `tk_<epochMsExpiracion>`.
   - Expiración lógica: `Date.now() + 120000`.
   - `Max-Age=120`.
   - `Path=/`.
   - `SameSite=Lax`.
4. Cada mensaje enviado a `ApiLLM.enviar(historial)` tenga el contrato exacto:

```js
[
  { rol: "user", contenido: "..." },
  { rol: "ia", contenido: "..." }
]
```

5. Al recibir `401`:
   - capturar con `try/catch`;
   - eliminar exclusivamente la conversación de `sessionStorage`;
   - conservar completamente `localStorage.favoritos`;
   - repintar el chat vacío;
   - mostrar un modal de sesión expirada.
6. El badge muestre `Token expira en mm:ss` usando el epoch real de la cookie.
7. El proyecto se ejecute mediante un servidor local, no con `file://`.

### Restricciones no negociables

- No modificar, envolver, monkey-patchear ni sustituir internamente `ApiLLM`.
- No hacer que el cliente dependa de una modificación del simulador.
- No usar `localStorage.clear()` ni `sessionStorage.clear()` de forma indiscriminada.
- No almacenar mensajes como strings sueltos.
- No mezclar acceso a storage, lógica de negocio, API y renderizado en un mismo módulo.
- No usar frameworks JS ni dependencias runtime; usa ES Modules.
- No usar `innerHTML` con contenido aportado por el usuario.
- No añadir un backend falso ni solicitudes de red decorativas para simular un 401.
- No esconder errores: tratar 401, 422 y fallos inesperados de forma diferenciada.

### Arquitectura requerida

Implementa arquitectura hexagonal pragmática con alta cohesión y bajo acoplamiento:

```text
src/
  domain/
    Message.js
    FavoritePrompt.js
  application/
    ChatService.js
    FavoriteService.js
    SessionService.js
    errors.js
    ports/
      ConversationRepositoryPort.js
      FavoriteRepositoryPort.js
      LlmGatewayPort.js
      TokenPort.js
  adapters/
    storage/
      SafeJsonStorage.js
      SessionConversationRepository.js
      LocalFavoriteRepository.js
    auth/
      CookieTokenAdapter.js
    api/
      ApiLlmGateway.js
    ui/
      DomWorkspaceView.js
  controllers/
    WorkspaceController.js
  config.js
  bootstrap.js
```

Los servicios de aplicación deben depender de puertos, no de `window`, `document`, `localStorage`, `sessionStorage` ni cookies.

### UI/UX requerida

Diseña una interfaz moderna, minimalista y profesional:

- estética oscura premium con superficies translúcidas;
- layout responsive de favoritos + conversación;
- tipografía clara y jerarquía visual fuerte;
- animaciones sutiles de entrada, mensajes, typing, modal y feedback;
- estados vacíos útiles;
- contador real del token;
- feedback mediante toast;
- loading state durante la latencia;
- foco visible y navegación por teclado;
- `aria-live`, labels, modal accesible;
- `prefers-reduced-motion`;
- contenido del usuario renderizado con `textContent`.

Evita animaciones excesivas, neón saturado o una interfaz que parezca una plantilla genérica de IA.

### Documentación obligatoria

Genera:

1. `README.md` con ejecución y demo.
2. `docs/ANALISIS_RIGUROSO.md`.
3. `docs/RESUMEN_EJECUTIVO.md`.
4. `docs/ARQUITECTURA.md` con diagrama Mermaid.
5. `docs/BITACORA_DEPURACION.md` con cada error original, evidencia DevTools, intervención y explicación.
6. `docs/GUIA_DEVTOOLS_Y_PRUEBAS.md`.
7. `docs/CHECKLIST_ENTREGA.md`.
8. Carpeta `evidencias/` con nombres sugeridos para capturas.

### Pruebas requeridas

Usa `node:test`, sin librerías externas, para cubrir como mínimo:

- validación del contrato de mensajes;
- persistencia y recuperación segura;
- favoritos persistentes y deduplicados;
- token con formato exacto y TTL de 120 segundos;
- envío exitoso y acumulación de contexto;
- 401 elimina conversación pero no toca favoritos;
- gateway entrega un DTO sin propiedades extra.

### Fases de trabajo

1. **Auditoría:** enumera todos los incumplimientos del borrador.
2. **Diseño:** presenta árbol de archivos, puertos, adaptadores y flujos.
3. **Dominio y aplicación:** implementa y prueba sin DOM.
4. **Adaptadores:** storage, cookie y API.
5. **UI y controlador:** integra sin romper capas.
6. **Pruebas:** ejecuta y corrige hasta verde.
7. **QA manual:** verifica Application, Console/Network, expiración y responsive.
8. **Documentación:** completa bitácora y checklist.

### Criterios de aceptación

No declares la tarea terminada hasta demostrar:

- `npm test` verde;
- cookie visible con nombre y formato exactos;
- `sessionStorage.conversacion` contiene objetos válidos;
- `localStorage.favoritos` sobrevive reinicio;
- 401 borra solo la conversación;
- favoritos intactos después del 401;
- badge llega a `00:00` aproximadamente a los 120 segundos;
- ningún cambio dentro del bloque congelado de `ApiLLM`;
- aplicación funcional en móvil y escritorio;
- documentación lista para entrega.

Al final, entrega un informe breve con archivos creados, decisiones, pruebas ejecutadas, riesgos conocidos y cualquier punto que todavía requiera evidencia manual.

---
