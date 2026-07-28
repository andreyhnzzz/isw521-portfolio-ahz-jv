import test from "node:test";
import assert from "node:assert/strict";
import { MemoryStorage } from "./helpers.js";
import { SessionConversationRepository } from "../src/adapters/storage/SessionConversationRepository.js";
import { LocalFavoriteRepository } from "../src/adapters/storage/LocalFavoriteRepository.js";
import { ChatService } from "../src/application/ChatService.js";
import { SessionExpiredError } from "../src/application/errors.js";

test("ChatService acumula contexto con el contrato requerido", async () => {
  const storage = new MemoryStorage();
  const repository = new SessionConversationRepository({ storage, key: "conversacion" });
  const calls = [];
  const gateway = {
    async send(history) {
      calls.push(history);
      return { respuesta: `Contexto ${history.length}` };
    }
  };
  const service = new ChatService({ conversationRepository: repository, llmGateway: gateway });

  await service.sendPrompt("Primero");
  await service.sendPrompt("Segundo");

  assert.equal(calls.length, 2);
  assert.deepEqual(calls[1], [
    { rol: "user", contenido: "Primero" },
    { rol: "ia", contenido: "Contexto 1" },
    { rol: "user", contenido: "Segundo" }
  ]);
  assert.equal(service.getConversation().length, 4);
});

test("401 elimina conversación y conserva favoritos", async () => {
  const sessionStorage = new MemoryStorage();
  const localStorage = new MemoryStorage();
  const conversationRepository = new SessionConversationRepository({ storage: sessionStorage, key: "conversacion" });
  const favoriteRepository = new LocalFavoriteRepository({ storage: localStorage, key: "favoritos" });
  favoriteRepository.save(["Prompt persistente"]);

  const service = new ChatService({
    conversationRepository,
    llmGateway: { async send() { throw { status: 401 }; } }
  });

  await assert.rejects(() => service.sendPrompt("Fallará"), SessionExpiredError);
  assert.deepEqual(conversationRepository.load(), []);
  assert.deepEqual(favoriteRepository.load(), ["Prompt persistente"]);
});
