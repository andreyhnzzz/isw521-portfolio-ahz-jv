const formatTime = totalSeconds => {
  const safe = Math.max(0, totalSeconds);
  const minutes = Math.floor(safe / 60).toString().padStart(2, "0");
  const seconds = Math.floor(safe % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export class DomWorkspaceView {
  constructor(documentRef = document) {
    this.documentRef = documentRef;
    this.elements = {
      conversation: documentRef.getElementById("conversation"),
      emptyConversation: documentRef.getElementById("emptyConversation"),
      favorites: documentRef.getElementById("favoritesList"),
      emptyFavorites: documentRef.getElementById("emptyFavorites"),
      favoritesCount: documentRef.getElementById("favoritesCount"),
      prompt: documentRef.getElementById("prompt"),
      send: documentRef.getElementById("sendButton"),
      saveFavorite: documentRef.getElementById("saveFavoriteButton"),
      login: documentRef.getElementById("loginButton"),
      tokenBadge: documentRef.getElementById("tokenBadge"),
      tokenText: documentRef.getElementById("tokenText"),
      tokenProgress: documentRef.getElementById("tokenProgress"),
      sessionMessageCount: documentRef.getElementById("sessionMessageCount"),
      localFavoriteCount: documentRef.getElementById("localFavoriteCount"),
      cookieState: documentRef.getElementById("cookieState"),
      modal: documentRef.getElementById("sessionModal"),
      closeModal: documentRef.getElementById("closeModalButton"),
      renewToken: documentRef.getElementById("renewTokenButton"),
      typing: documentRef.getElementById("typingIndicator"),
      toastRegion: documentRef.getElementById("toastRegion")
    };
  }

  bindSend(handler) {
    this.elements.send.addEventListener("click", () => handler(this.getPrompt()));
    this.elements.prompt.addEventListener("keydown", event => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handler(this.getPrompt());
      }
    });
  }

  bindSaveFavorite(handler) {
    this.elements.saveFavorite.addEventListener("click", () => handler(this.getPrompt()));
  }

  bindLogin(handler) {
    this.elements.login.addEventListener("click", handler);
    this.elements.renewToken.addEventListener("click", handler);
  }

  bindCloseModal(handler) {
    this.elements.closeModal.addEventListener("click", handler);
    this.elements.modal.addEventListener("click", event => {
      if (event.target === this.elements.modal) handler();
    });
  }

  bindFavoriteActions({ onUse, onRemove }) {
    this.elements.favorites.addEventListener("click", event => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const index = Number(button.dataset.index);
      if (button.dataset.action === "use") onUse(index);
      if (button.dataset.action === "remove") onRemove(index);
    });
  }

  getPrompt() {
    return this.elements.prompt.value.trim();
  }

  setPrompt(value) {
    this.elements.prompt.value = value;
    this.focusPrompt();
  }

  clearPrompt() {
    this.elements.prompt.value = "";
  }

  focusPrompt() {
    this.elements.prompt.focus({ preventScroll: true });
  }

  renderConversation(messages) {
    this.elements.conversation
      .querySelectorAll(".message")
      .forEach(node => node.remove());

    for (const message of messages) {
      this.elements.conversation.insertBefore(
        this.createMessageNode(message),
        this.elements.typing
      );
    }

    this.elements.emptyConversation.hidden = messages.length > 0;
    this.elements.sessionMessageCount.textContent = String(messages.length);
    this.scrollConversation();
  }

  createMessageNode(message) {
    const article = this.documentRef.createElement("article");
    article.className = `message message--${message.rol}`;
    article.setAttribute("aria-label", message.rol === "user" ? "Mensaje del usuario" : "Respuesta de la IA");

    const avatar = this.documentRef.createElement("div");
    avatar.className = "message__avatar";
    avatar.textContent = message.rol === "user" ? "TÚ" : "IA";

    const content = this.documentRef.createElement("p");
    content.className = "message__content";
    content.textContent = message.contenido;

    article.append(avatar, content);
    return article;
  }

  renderFavorites(favorites) {
    this.elements.favorites
      .querySelectorAll(".favorite")
      .forEach(node => node.remove());

    favorites.forEach((favorite, index) => {
      const item = this.documentRef.createElement("article");
      item.className = "favorite";

      const text = this.documentRef.createElement("p");
      text.className = "favorite__text";
      text.textContent = favorite;

      const actions = this.documentRef.createElement("div");
      actions.className = "favorite__actions";
      actions.innerHTML = `
        <button class="ghost-button" type="button" data-action="use" data-index="${index}" aria-label="Usar este prompt">Usar</button>
        <button class="icon-button" type="button" data-action="remove" data-index="${index}" aria-label="Eliminar este prompt">×</button>
      `;

      item.append(text, actions);
      this.elements.favorites.appendChild(item);
    });

    this.elements.emptyFavorites.hidden = favorites.length > 0;
    this.elements.favoritesCount.textContent = String(favorites.length);
    this.elements.localFavoriteCount.textContent = String(favorites.length);
  }

  setBusy(isBusy) {
    this.elements.send.disabled = isBusy;
    this.elements.prompt.disabled = isBusy;
    this.elements.typing.hidden = !isBusy;
    this.elements.send.classList.toggle("is-loading", isBusy);
    if (isBusy) this.scrollConversation();
  }

  updateSessionStatus(status) {
    const badge = this.elements.tokenBadge;
    badge.dataset.state = status.state;
    this.elements.tokenProgress.style.transform = `scaleX(${status.progress ?? 0})`;

    if (status.state === "active") {
      this.elements.tokenText.textContent = `Token expira en ${formatTime(status.remainingSeconds)}`;
      this.elements.cookieState.textContent = "Activa";
      this.elements.login.textContent = "Renovar token";
      return;
    }

    if (status.state === "expired") {
      this.elements.tokenText.textContent = "Token expirado";
      this.elements.cookieState.textContent = "Expirada";
      this.elements.login.textContent = "Iniciar sesión";
      return;
    }

    this.elements.tokenText.textContent = "Sin sesión";
    this.elements.cookieState.textContent = "Ausente";
    this.elements.login.textContent = "Iniciar sesión";
  }

  showSessionExpiredModal() {
    this.elements.modal.hidden = false;
    requestAnimationFrame(() => this.elements.modal.classList.add("is-visible"));
    this.elements.renewToken.focus();
  }

  hideSessionExpiredModal() {
    this.elements.modal.classList.remove("is-visible");
    setTimeout(() => {
      this.elements.modal.hidden = true;
      this.focusPrompt();
    }, 180);
  }

  showToast(message, type = "info") {
    const toast = this.documentRef.createElement("div");
    toast.className = `toast toast--${type}`;
    toast.setAttribute("role", "status");
    toast.textContent = message;
    this.elements.toastRegion.appendChild(toast);
    setTimeout(() => toast.classList.add("is-visible"), 10);
    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 180);
    }, 3200);
  }

  scrollConversation() {
    requestAnimationFrame(() => {
      this.elements.conversation.scrollTop = this.elements.conversation.scrollHeight;
    });
  }
}
