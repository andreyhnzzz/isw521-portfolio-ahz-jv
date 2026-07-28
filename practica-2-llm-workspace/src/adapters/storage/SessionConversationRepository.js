import { ConversationRepositoryPort } from "../../application/ports/ConversationRepositoryPort.js";
import { Message } from "../../domain/Message.js";
import { SafeJsonStorage } from "./SafeJsonStorage.js";

export class SessionConversationRepository extends ConversationRepositoryPort {
  constructor({ storage, key }) {
    super();
    this.key = key;
    this.jsonStorage = new SafeJsonStorage(storage);
  }

  load() {
    const raw = this.jsonStorage.read(this.key, []);
    if (!Array.isArray(raw)) return [];
    return raw.map(Message.restore).filter(Boolean);
  }

  save(messages) {
    const validMessages = messages.map(Message.restore).filter(Boolean);
    this.jsonStorage.write(this.key, validMessages);
  }

  clear() {
    this.jsonStorage.remove(this.key);
  }
}
