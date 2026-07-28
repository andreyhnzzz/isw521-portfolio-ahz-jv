import { FavoriteRepositoryPort } from "../../application/ports/FavoriteRepositoryPort.js";
import { FavoritePrompt } from "../../domain/FavoritePrompt.js";
import { SafeJsonStorage } from "./SafeJsonStorage.js";

export class LocalFavoriteRepository extends FavoriteRepositoryPort {
  constructor({ storage, key }) {
    super();
    this.key = key;
    this.jsonStorage = new SafeJsonStorage(storage);
  }

  load() {
    const raw = this.jsonStorage.read(this.key, []);
    if (!Array.isArray(raw)) return [];

    const normalized = [];
    for (const item of raw) {
      try {
        const prompt = FavoritePrompt.create(item);
        if (!normalized.includes(prompt)) normalized.push(prompt);
      } catch {
        // Ignora registros corruptos sin romper toda la aplicación.
      }
    }
    return normalized;
  }

  save(favorites) {
    this.jsonStorage.write(this.key, favorites);
  }
}
