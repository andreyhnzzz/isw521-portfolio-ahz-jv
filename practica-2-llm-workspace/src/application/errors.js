export class SessionExpiredError extends Error {
  constructor(cause) {
    super("La sesión expiró o el token es inválido.", { cause });
    this.name = "SessionExpiredError";
    this.status = 401;
  }
}

export class LlmRequestError extends Error {
  constructor(message, status, cause) {
    super(message, { cause });
    this.name = "LlmRequestError";
    this.status = status ?? 500;
  }
}
