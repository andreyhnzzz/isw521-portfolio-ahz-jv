import { STORAGE_KEYS, TOKEN_CONFIG, UI_CONFIG } from "./config.js";
import { ChatService } from "./application/ChatService.js";
import { FavoriteService } from "./application/FavoriteService.js";
import { SessionService } from "./application/SessionService.js";
import { SessionConversationRepository } from "./adapters/storage/SessionConversationRepository.js";
import { LocalFavoriteRepository } from "./adapters/storage/LocalFavoriteRepository.js";
import { CookieTokenAdapter } from "./adapters/auth/CookieTokenAdapter.js";
import { ApiLlmGateway } from "./adapters/api/ApiLlmGateway.js";
import { DomWorkspaceView } from "./adapters/ui/DomWorkspaceView.js";
import { WorkspaceController } from "./controllers/WorkspaceController.js";

export function bootstrap({ apiLLM, windowRef = window, documentRef = document }) {
  const conversationRepository = new SessionConversationRepository({
    storage: windowRef.sessionStorage,
    key: STORAGE_KEYS.conversation
  });

  const favoriteRepository = new LocalFavoriteRepository({
    storage: windowRef.localStorage,
    key: STORAGE_KEYS.favorites
  });

  const tokenPort = new CookieTokenAdapter({
    documentRef,
    cookieName: TOKEN_CONFIG.cookieName,
    prefix: TOKEN_CONFIG.prefix,
    path: TOKEN_CONFIG.path,
    sameSite: TOKEN_CONFIG.sameSite
  });

  const chatService = new ChatService({
    conversationRepository,
    llmGateway: new ApiLlmGateway(apiLLM)
  });

  const favoriteService = new FavoriteService({
    favoriteRepository,
    maxFavorites: UI_CONFIG.maxFavorites
  });

  const sessionService = new SessionService({
    tokenPort,
    ttlSeconds: TOKEN_CONFIG.ttlSeconds
  });

  const controller = new WorkspaceController({
    chatService,
    favoriteService,
    sessionService,
    view: new DomWorkspaceView(documentRef),
    countdownIntervalMs: UI_CONFIG.countdownIntervalMs
  });

  controller.start();
  return controller;
}
