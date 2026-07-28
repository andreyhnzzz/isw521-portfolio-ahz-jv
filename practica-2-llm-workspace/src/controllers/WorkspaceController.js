import { LlmRequestError, SessionExpiredError } from "../application/errors.js";

export class WorkspaceController {
  constructor({ chatService, favoriteService, sessionService, view, countdownIntervalMs = 250 }) {
    this.chatService = chatService;
    this.favoriteService = favoriteService;
    this.sessionService = sessionService;
    this.view = view;
    this.countdownIntervalMs = countdownIntervalMs;
    this.countdownTimer = null;
  }

  start() {
    this.renderAll();
    this.bindEvents();
    this.updateCountdown();
    this.countdownTimer = window.setInterval(
      () => this.updateCountdown(),
      this.countdownIntervalMs
    );
    this.view.focusPrompt();
  }

  bindEvents() {
    this.view.bindSend(text => this.handleSend(text));
    this.view.bindSaveFavorite(text => this.handleSaveFavorite(text));
    this.view.bindLogin(() => this.handleLogin());
    this.view.bindCloseModal(() => this.view.hideSessionExpiredModal());
    this.view.bindFavoriteActions({
      onUse: index => this.handleUseFavorite(index),
      onRemove: index => this.handleRemoveFavorite(index)
    });
  }

  renderAll() {
    this.view.renderConversation(this.chatService.getConversation());
    this.view.renderFavorites(this.favoriteService.list());
  }

  async handleSend(text) {
    if (!text) {
      this.view.showToast("Escribe un prompt antes de enviarlo.", "warning");
      return;
    }

    this.view.clearPrompt();
    this.view.setBusy(true);

    const pendingRequest = this.chatService.sendPrompt(text);
    this.view.renderConversation(this.chatService.getConversation());

    try {
      await pendingRequest;
      this.view.renderConversation(this.chatService.getConversation());
    } catch (error) {
      if (error instanceof SessionExpiredError) {
        this.view.renderConversation([]);
        this.view.showSessionExpiredModal();
        this.view.showToast("La conversación de esta pestaña fue eliminada; los favoritos siguen intactos.", "error");
      } else if (error instanceof LlmRequestError) {
        this.view.showToast(error.message, "error");
      } else {
        this.view.showToast("Ocurrió un error inesperado.", "error");
      }
    } finally {
      this.view.setBusy(false);
      this.updateCountdown();
      this.view.focusPrompt();
    }
  }

  handleSaveFavorite(text) {
    if (!text) {
      this.view.showToast("Escribe un prompt para guardarlo como favorito.", "warning");
      return;
    }

    try {
      const result = this.favoriteService.add(text);
      this.view.renderFavorites(result.favorites);

      if (result.added) {
        this.view.showToast("Prompt guardado en localStorage.", "success");
      } else if (result.reason === "duplicate") {
        this.view.showToast("Ese prompt ya está en favoritos.", "warning");
      } else {
        this.view.showToast("Se alcanzó el límite de favoritos.", "warning");
      }
    } catch (error) {
      this.view.showToast(error.message, "error");
    }
  }

  handleUseFavorite(index) {
    const favorite = this.favoriteService.list()[index];
    if (favorite) this.view.setPrompt(favorite);
  }

  handleRemoveFavorite(index) {
    const favorites = this.favoriteService.remove(index);
    this.view.renderFavorites(favorites);
    this.view.showToast("Favorito eliminado.", "info");
  }

  handleLogin() {
    const status = this.sessionService.start();
    this.view.updateSessionStatus(status);
    this.view.hideSessionExpiredModal();
    this.view.showToast("Token emitido por 2 minutos.", "success");
  }

  updateCountdown() {
    this.view.updateSessionStatus(this.sessionService.getStatus());
  }
}
