export class FavoritePrompt {
  static create(value) {
    if (typeof value !== "string") {
      throw new TypeError("El prompt favorito debe ser texto.");
    }

    const normalized = value.trim();
    if (!normalized) {
      throw new TypeError("No se puede guardar un prompt vacío.");
    }

    return normalized;
  }
}
