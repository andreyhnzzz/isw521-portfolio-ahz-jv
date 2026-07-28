export const STORAGE_KEYS = Object.freeze({
  conversation: "conversacion",
  favorites: "favoritos"
});

export const TOKEN_CONFIG = Object.freeze({
  cookieName: "llm_token",
  prefix: "tk_",
  ttlSeconds: 120,
  path: "/",
  sameSite: "Lax"
});

export const MESSAGE_ROLES = Object.freeze({
  user: "user",
  assistant: "ia"
});

export const UI_CONFIG = Object.freeze({
  countdownIntervalMs: 250,
  maxFavorites: 50
});
