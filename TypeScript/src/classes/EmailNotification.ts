import { BaseNotification } from "./BaseNotification.js";

export class EmailNotification extends BaseNotification {
  send(message: string): void {
    console.log(`Enviando EMAIL a ${this.recipient}: ${message}`);
  }
}
