import test from "node:test";
import assert from "node:assert/strict";
import { ApiLlmGateway } from "../src/adapters/api/ApiLlmGateway.js";

test("gateway envía un DTO sin propiedades extra", async () => {
  let received;
  const gateway = new ApiLlmGateway({
    async enviar(history) {
      received = history;
      return { status: 200, respuesta: "ok" };
    }
  });

  await gateway.send([{ rol: "user", contenido: "Hola", uiId: 99 }]);
  assert.deepEqual(received, [{ rol: "user", contenido: "Hola" }]);
});
