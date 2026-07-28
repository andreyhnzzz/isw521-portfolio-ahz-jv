# Práctica 2 — Memoria de Contexto del LLM

Solución profesional del **Prompt Engineer Workspace** con JavaScript nativo, arquitectura hexagonal pragmática y cero dependencias de producción.

## Qué cumple

- Conversación actual en `sessionStorage`, clave `conversacion`.
- Favoritos en `localStorage`, clave `favoritos`.
- Cookie exacta `llm_token=tk_<epochMsExpiracion>` con `Max-Age=120`.
- Historial con el contrato exacto `[{ rol: "user"|"ia", contenido: string }]`.
- Manejo de `401` con `try/catch`: elimina solo la conversación y conserva favoritos.
- Cuenta regresiva real `mm:ss`.
- `ApiLLM` permanece congelada y sin modificaciones.
- UI moderna, responsive, accesible y con animaciones respetuosas de `prefers-reduced-motion`.
- Bitácora, guía de DevTools, checklist, análisis y prompt maestro incluidos.

## Ejecutar en Windows

1. Haz doble clic en `start-windows.bat`.
2. Abre `http://localhost:5500`.

Alternativa desde PowerShell:

```powershell
py -m http.server 5500
```

## Ejecutar en Linux/macOS

```bash
./start-linux.sh
```

Luego abre `http://localhost:5500`.

> No abras `index.html` con doble clic. Las cookies no son confiables bajo `file://`.

## Pruebas automatizadas

Requiere Node.js 18 o superior:

```bash
npm test
```

## Flujo mínimo de demostración

1. Inicia sesión y confirma en DevTools → Application la cookie `llm_token`.
2. Envía dos prompts y confirma `sessionStorage.conversacion`.
3. Guarda un favorito y confirma `localStorage.favoritos`.
4. Espera dos minutos y vuelve a enviar.
5. Verifica el modal 401, la conversación eliminada y el favorito intacto.

## Documentos clave

- `docs/RESUMEN_EJECUTIVO.md`
- `docs/ANALISIS_RIGUROSO.md`
- `docs/PROMPT_MAESTRO.md`
- `docs/BITACORA_DEPURACION.md`
- `docs/GUIA_DEVTOOLS_Y_PRUEBAS.md`
- `docs/CHECKLIST_ENTREGA.md`
