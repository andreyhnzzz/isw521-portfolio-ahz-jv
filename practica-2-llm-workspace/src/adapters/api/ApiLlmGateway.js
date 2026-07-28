import { LlmGatewayPort } from "../../application/ports/LlmGatewayPort.js";

export class ApiLlmGateway extends LlmGatewayPort {
  constructor(apiLLM) {
    super();
    if (!apiLLM || typeof apiLLM.enviar !== "function") {
      throw new TypeError("ApiLlmGateway requiere un ApiLLM compatible.");
    }
    this.apiLLM = apiLLM;
  }

  async send(history) {
    // Se crea un DTO exacto para no filtrar propiedades de UI o infraestructura.
    const contextDto = history.map(({ rol, contenido }) => ({ rol, contenido }));
    return this.apiLLM.enviar(contextDto);
  }
}
