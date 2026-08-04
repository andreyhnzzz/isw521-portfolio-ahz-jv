import type { INotification } from "../interfaces/INotification.js";

export class NotificationService {
  notify(notification: INotification, message: string): void {
    notification.send(message);
  }
}
