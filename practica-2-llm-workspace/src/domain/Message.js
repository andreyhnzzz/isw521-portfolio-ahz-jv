import { MESSAGE_ROLES } from "../config.js";

const VALID_ROLES = new Set(Object.values(MESSAGE_ROLES));

export class Message {
  static create(rol, contenido) {
    if (!VALID_ROLES.has(rol)) {
      throw new TypeError(`Rol de mensaje inválido: ${rol}`);
    }

    if (typeof contenido !== "string" || contenido.trim().length === 0) {
      throw new TypeError("El contenido del mensaje debe ser texto no vacío.");
    }

    return Object.freeze({
      rol,
      contenido: contenido.trim()
    });
  }

  static restore(candidate) {
    try {
      if (!candidate || typeof candidate !== "object") return null;
      return Message.create(candidate.rol, candidate.contenido);
    } catch {
      return null;
    }
  }
}
