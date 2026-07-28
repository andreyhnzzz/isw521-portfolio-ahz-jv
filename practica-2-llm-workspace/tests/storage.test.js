import test from "node:test";
import assert from "node:assert/strict";
import { MemoryStorage } from "./helpers.js";
import { SessionConversationRepository } from "../src/adapters/storage/SessionConversationRepository.js";
import { LocalFavoriteRepository } from "../src/adapters/storage/LocalFavoriteRepository.js";

test("repositorio de conversación persiste objetos válidos y limpia solo su clave", () => {
  const storage = new MemoryStorage();
  storage.setItem("otra", "intacta");
  const repository = new SessionConversationRepository({ storage, key: "conversacion" });

  repository.save([{ rol: "user", contenido: "Hola" }]);
  assert.deepEqual(repository.load(), [{ rol: "user", contenido: "Hola" }]);

  repository.clear();
  assert.deepEqual(repository.load(), []);
  assert.equal(storage.getItem("otra"), "intacta");
});

test("repositorio de favoritos recupera, deduplica e ignora corrupción", () => {
  const storage = new MemoryStorage();
  storage.setItem("favoritos", JSON.stringify([" A ", "A", "", 7, "B"]));
  const repository = new LocalFavoriteRepository({ storage, key: "favoritos" });
  assert.deepEqual(repository.load(), ["A", "B"]);
});

test("JSON inválido no rompe el arranque", () => {
  const storage = new MemoryStorage();
  storage.setItem("conversacion", "{mal-json");
  const repository = new SessionConversationRepository({ storage, key: "conversacion" });
  assert.deepEqual(repository.load(), []);
  assert.equal(storage.getItem("conversacion"), null);
});
