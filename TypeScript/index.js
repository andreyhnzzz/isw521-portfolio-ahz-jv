class EmailNotification {
    recipient;
    constructor(recipient) {
        this.recipient = recipient;
    }
    send(message) {
        console.log(`Enviando EMAIL a ${this.recipient}: ${message}`);
    }
}
class SmsNotification {
    recipient;
    constructor(recipient) {
        this.recipient = recipient;
    }
    send(message) {
        console.log(`Enviando SMS a ${this.recipient}: ${message}`);
    }
}
function notify(notification, message) {
    notification.send(message);
}
const email = new EmailNotification("ana@correo.com");
const sms = new SmsNotification("+50412345678");
notify(email, "Tu cita es mañana a las 10am");
notify(sms, "Tu cita es mañana a las 10am");
export {};
//# sourceMappingURL=index.js.map