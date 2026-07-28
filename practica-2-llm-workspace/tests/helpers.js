export class MemoryStorage {
  constructor() { this.data = new Map(); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  setItem(key, value) { this.data.set(key, String(value)); }
  removeItem(key) { this.data.delete(key); }
  clear() { this.data.clear(); }
}

export class FakeCookieDocument {
  constructor(clock = () => Date.now()) {
    this.clock = clock;
    this.cookies = new Map();
    this.attributes = new Map();
  }

  set cookie(serialized) {
    const parts = serialized.split(";").map(part => part.trim());
    const [nameValue, ...attributes] = parts;
    const separator = nameValue.indexOf("=");
    const name = nameValue.slice(0, separator);
    const value = nameValue.slice(separator + 1);
    const maxAge = attributes.find(item => item.toLowerCase().startsWith("max-age="));

    if (maxAge && Number(maxAge.split("=")[1]) <= 0) {
      this.cookies.delete(name);
      this.attributes.delete(name);
      return;
    }

    this.cookies.set(name, value);
    this.attributes.set(name, attributes);
  }

  get cookie() {
    return [...this.cookies.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
  }
}
