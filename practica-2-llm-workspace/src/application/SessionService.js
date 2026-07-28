export class SessionService {
  constructor({ tokenPort, ttlSeconds, clock = () => Date.now() }) {
    this.tokenPort = tokenPort;
    this.ttlSeconds = ttlSeconds;
    this.clock = clock;
    this.lastKnownExpiration = null;
  }

  start() {
    const token = this.tokenPort.issue(this.ttlSeconds);
    this.lastKnownExpiration = token.expiresAt;
    return this.getStatus();
  }

  getStatus() {
    const token = this.tokenPort.read();
    const now = this.clock();

    if (token) {
      this.lastKnownExpiration = token.expiresAt;
      const remainingMs = Math.max(0, token.expiresAt - now);
      return {
        state: remainingMs > 0 ? "active" : "expired",
        expiresAt: token.expiresAt,
        remainingSeconds: Math.ceil(remainingMs / 1000),
        progress: Math.min(1, remainingMs / (this.ttlSeconds * 1000))
      };
    }

    if (this.lastKnownExpiration && this.lastKnownExpiration <= now) {
      return { state: "expired", expiresAt: this.lastKnownExpiration, remainingSeconds: 0, progress: 0 };
    }

    return { state: "none", expiresAt: null, remainingSeconds: 0, progress: 0 };
  }

  clear() {
    this.tokenPort.clear();
    this.lastKnownExpiration = null;
  }
}
