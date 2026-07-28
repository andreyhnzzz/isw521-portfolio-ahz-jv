export class SafeJsonStorage {
  constructor(storage) {
    this.storage = storage;
  }

  read(key, fallback) {
    const raw = this.storage.getItem(key);
    if (raw === null) return fallback;

    try {
      return JSON.parse(raw);
    } catch {
      this.storage.removeItem(key);
      return fallback;
    }
  }

  write(key, value) {
    this.storage.setItem(key, JSON.stringify(value));
  }

  remove(key) {
    this.storage.removeItem(key);
  }
}
