import { FavoritePrompt } from "../domain/FavoritePrompt.js";

export class FavoriteService {
  constructor({ favoriteRepository, maxFavorites = 50 }) {
    this.favoriteRepository = favoriteRepository;
    this.maxFavorites = maxFavorites;
  }

  list() {
    return this.favoriteRepository.load();
  }

  add(rawPrompt) {
    const prompt = FavoritePrompt.create(rawPrompt);
    const favorites = this.favoriteRepository.load();

    if (favorites.includes(prompt)) {
      return { added: false, reason: "duplicate", favorites };
    }

    if (favorites.length >= this.maxFavorites) {
      return { added: false, reason: "limit", favorites };
    }

    const updated = [prompt, ...favorites];
    this.favoriteRepository.save(updated);
    return { added: true, favorites: updated };
  }

  remove(index) {
    const favorites = this.favoriteRepository.load();
    if (!Number.isInteger(index) || index < 0 || index >= favorites.length) {
      return favorites;
    }

    const updated = favorites.filter((_, itemIndex) => itemIndex !== index);
    this.favoriteRepository.save(updated);
    return updated;
  }
}
