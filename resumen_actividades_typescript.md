# Resumen — Actividades de Análisis: Tipado en TypeScript

## 1.1 — strictNullChecks: ¿compilación o ejecución?

`obtenerUsuario().nombre.toUpperCase()`, donde la función puede devolver `undefined`.

- **Sin `strictNullChecks`** (o si la firma miente, ej. `Usuario` en vez de `Usuario | undefined`): el compilador confía ciegamente en la firma. El error **no se detecta en compilación** y explota en runtime (`TypeError`).
- **Con `strictNullChecks`** y firma honesta (`Usuario | undefined`): el compilador exige manejar el caso `undefined` **antes** de compilar. El error se detecta en **tiempo de compilación**.

**Idea clave:** el compilador no adivina la realidad del código, solo confía en lo que la firma de tipos le dice.

---

## 1.2 — `any` vs `unknown`

```typescript
function procesar(input: unknown): string {
  if (typeof input !== "number") {
    throw new Error("procesar() espera un número");
  }
  return input.toFixed(2);
}
```

- `any` **desactiva** el chequeo de tipos: `procesar("hola")` compila y explota en runtime.
- `unknown` **mantiene** el chequeo activo: no te deja usar `input.toFixed()` hasta demostrar (con `typeof`, un type guard) qué tipo es realmente.

**Idea clave:** `unknown` es "adivinar con evidencia"; `any` es "adivinar a ciegas".

---

## 2.1 — Type Alias: nombrar una forma de dato

```typescript
type DisponibilidadLab = {
  estado: 'disponible' | 'ocupado' | 'en-mantenimiento';
  computadorasLibres: number;
};
```

- `estado: string` sería demasiado permisivo (aceptaría cualquier texto, incluso typos).
- La unión de literales (`'disponible' | 'ocupado' | 'en-mantenimiento'`) restringe los valores válidos y habilita **narrowing** dentro de un `if`.

**Idea clave:** cuanto más preciso el tipo, menos espacio para que el error llegue a runtime.

---

## 2.2 — Interface: contrato estructural de un objeto

```typescript
interface CursoMatriculado {
  codigo: string;
  creditos: number;
}

interface Factura {
  numeroFactura: string;
  nombreEstudiante: string;
  montoTotal: number;
  cursos: CursoMatriculado[];
  fechaEmision?: string;
  descuentoAplicado?: number;
  observaciones?: string;
}
```

- **Obligatorios:** los datos sin los cuales el objeto no tiene sentido como factura.
- **Opcionales (`?`):** datos que pueden no aplicar sin invalidar el objeto; obligan a chequear con `??` o similar antes de usarlos.
- `interface` se puede **extender**: `interface FacturaConMora extends Factura { diasAtraso: number; }`

---

## 2.3 — Type vs Interface: la decisión que importa

Respuesta de login con dos formas alternativas:

```typescript
type LoginExitoso = { exito: true; token: string; };
type LoginFallido  = { exito: false; mensajeError: string; };
type RespuestaLogin = LoginExitoso | LoginFallido;
```

- `interface` **no admite uniones** (`|`); solo describe una forma de objeto y se extiende.
- `type` sí puede nombrar uniones, y con un campo discriminante (`exito: true/false`) TypeScript hace **narrowing automático** dentro de los `if`.

**Regla práctica:**
- "Esto **Y** esto" → `interface`
- "Esto **O** esto" → `type` con unión

---

## Hilo conductor de las 4 actividades

| Actividad | Concepto | Mecanismo de seguridad |
|---|---|---|
| 1.1 | `strictNullChecks` | Obliga a declarar y manejar `undefined`/`null` |
| 1.2 | `unknown` vs `any` | Obliga a demostrar el tipo antes de operar |
| 2.1 | `type` (unión de literales) | Restringe valores válidos, habilita narrowing |
| 2.2 | `interface` | Modela objetos, distingue obligatorio/opcional |
| 2.3 | `type` con unión discriminada | Modela alternativas excluyentes entre sí |

**Conclusión general:** mientras más preciso y honesto sea el tipo declarado, más errores se detectan en compilación en vez de en ejecución.
