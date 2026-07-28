# Arquitectura hexagonal

## Capas

### Dominio

- `Message.js`: invariantes del historial.
- `FavoritePrompt.js`: normalización de favoritos.

No importa DOM, Web Storage ni API.

### Aplicación

- `ChatService.js`: caso de uso de envío y reacción al 401.
- `FavoriteService.js`: listar, guardar, evitar duplicados y eliminar.
- `SessionService.js`: emitir token y calcular estado restante.
- `ports/`: contratos que invierten dependencias.

### Adaptadores de salida

- `SessionConversationRepository.js` → `sessionStorage`.
- `LocalFavoriteRepository.js` → `localStorage`.
- `CookieTokenAdapter.js` → `document.cookie`.
- `ApiLlmGateway.js` → simulador congelado.

### Adaptadores de entrada

- `DomWorkspaceView.js` → renderizado y eventos DOM.
- `WorkspaceController.js` → traduce interacciones en casos de uso.

### Composición

`bootstrap.js` crea las dependencias y las inyecta. Es el único punto que conoce todas las piezas.

## Reglas de dependencia

1. Dominio no importa ninguna capa externa.
2. Aplicación solo depende del dominio y puertos.
3. Adaptadores implementan puertos.
4. UI no accede directamente a storage o cookies.
5. `ApiLLM` se recibe por inyección.

## Motivo de esta arquitectura

Permite defender claramente por qué cada mecanismo de persistencia existe, probar el comportamiento sin navegador y reemplazar la API simulada por la del profesor sin tocar la lógica central.
