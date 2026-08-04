import { BaseNotification } from "./BaseNotification.js";
export class SmsNotification extends BaseNotification {
    send(message) {
        console.log(`Enviando SMS a ${this.recipient}: ${message}`);
    }
}
//# sourceMappingURL=SmsNotification.js.map