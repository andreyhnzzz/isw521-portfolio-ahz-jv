import { Message } from "../domain/Message.js";
import { MESSAGE_ROLES } from "../config.js";
import { LlmRequestError, SessionExpiredError } from "./errors.js";

export class ChatService {
  constructor({ conversationRepository, llmGateway }) {
    this.conversationRepository = conversationRepository;
    this.llmGateway = llmGateway;
  }

  getConversation() {
    return this.conversationRepository.load();
  }

  async sendPrompt(rawText) {
    const userMessage = Message.create(MESSAGE_ROLES.user, rawText);
    const history = [...this.conversationRepository.load(), userMessage];

    // Persistimos antes de la latencia para que la UI pueda pintar el mensaje de inmediato.
    this.conversationRepository.save(history);

    try {
      const response = await this.llmGateway.send(history);
      const assistantMessage = Message.create(
        MESSAGE_ROLES.assistant,
        response?.respuesta
      );
      const completedHistory = [...this.conversationRepository.load(), assistantMessage];
      this.conversationRepository.save(completedHistory);
      return assistantMessage;
    } catch (error) {
      if (error?.status === 401) {
        // Regla crítica: se elimina únicamente la conversación de la pestaña.
        this.conversationRepository.clear();
        throw new SessionExpiredError(error);
      }

      throw new LlmRequestError(
        error?.status === 422
          ? "La API rechazó el formato del contexto (422)."
          : "No fue posible obtener una respuesta del LLM.",
        error?.status,
        error
      );
    }
  }
}
