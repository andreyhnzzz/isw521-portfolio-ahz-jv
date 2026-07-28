import test from "node:test";
import assert from "node:assert/strict";
import { Message } from "../src/domain/Message.js";

test("Message crea el contrato exacto", () => {
  const message = Message.create("user", "  Hola  ");
  assert.deepEqual(message, { rol: "user", contenido: "Hola" });
  assert.equal(Object.isFrozen(message), true);
});

test("Message rechaza roles y contenido inválidos", () => {
  assert.throws(() => Message.create("assistant", "Hola"), /Rol/);
  assert.throws(() => Message.create("ia", "  "), /contenido/);
});

test("Message.restore descarta registros corruptos", () => {
  assert.equal(Message.restore("texto"), null);
  assert.equal(Message.restore({ rol: "x", contenido: "a" }), null);
  assert.deepEqual(Message.restore({ rol: "ia", contenido: "OK" }), { rol: "ia", contenido: "OK" });
});
