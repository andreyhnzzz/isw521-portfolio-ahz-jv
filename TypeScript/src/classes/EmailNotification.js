import { BaseNotification } from "./BaseNotification.js";
export class EmailNotification extends BaseNotification {
    send(message) {
        console.log(`Enviando EMAIL a ${this.recipient}: ${message}`);
    }
}
//# sourceMappingURL=EmailNotification.js.map