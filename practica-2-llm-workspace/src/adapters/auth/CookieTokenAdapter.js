import { TokenPort } from "../../application/ports/TokenPort.js";

export class CookieTokenAdapter extends TokenPort {
  constructor({ documentRef, cookieName, prefix, path = "/", sameSite = "Lax", clock = () => Date.now() }) {
    super();
    this.documentRef = documentRef;
    this.cookieName = cookieName;
    this.prefix = prefix;
    this.path = path;
    this.sameSite = sameSite;
    this.clock = clock;
  }

  issue(ttlSeconds) {
    const expiresAt = this.clock() + ttlSeconds * 1000;
    const value = `${this.prefix}${expiresAt}`;
    const expires = new Date(expiresAt).toUTCString();

    this.documentRef.cookie = [
      `${this.cookieName}=${encodeURIComponent(value)}`,
      `Max-Age=${ttlSeconds}`,
      `Expires=${expires}`,
      `Path=${this.path}`,
      `SameSite=${this.sameSite}`
    ].join("; ");

    return { value, expiresAt };
  }

  read() {
    const escapedName = this.cookieName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = this.documentRef.cookie.match(
      new RegExp(`(?:^|;\\s*)${escapedName}=([^;]+)`)
    );
    if (!match) return null;

    const value = decodeURIComponent(match[1]);
    const expected = new RegExp(`^${this.prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\d+)$`);
    const tokenMatch = value.match(expected);
    if (!tokenMatch) return null;

    const expiresAt = Number(tokenMatch[1]);
    if (!Number.isFinite(expiresAt)) return null;

    return { value, expiresAt };
  }

  clear() {
    this.documentRef.cookie = [
      `${this.cookieName}=`,
      "Max-Age=0",
      "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
      `Path=${this.path}`,
      `SameSite=${this.sameSite}`
    ].join("; ");
  }
}
