class EmailNotification {
  constructor(public recipient: string) {}

  send(message: string): void {
    console.log(`Enviando EMAIL a ${this.recipient}: ${message}`);
  }
}

class SmsNotification {
  constructor(public recipient: string) {}

  send(message: string): void {
    console.log(`Enviando SMS a ${this.recipient}: ${message}`);
  }
}

function notify(notification: EmailNotification | SmsNotification, message: string): void {
  notification.send(message);
}

const email = new EmailNotification("ana@correo.com");
const sms = new SmsNotification("+50412345678");

notify(email, "Tu cita es mañana a las 10am");
notify(sms, "Tu cita es mañana a las 10am");
