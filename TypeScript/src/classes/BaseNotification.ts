import type { INotification } from "../interfaces/INotification.js";

export abstract class BaseNotification implements INotification {
  constructor(protected recipient: string) {}

  abstract send(message: string): void;
}
