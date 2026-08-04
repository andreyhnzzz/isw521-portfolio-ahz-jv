import type { INotification } from "../interfaces/INotification.js";
export declare abstract class BaseNotification implements INotification {
    protected recipient: string;
    constructor(recipient: string);
    abstract send(message: string): void;
}
//# sourceMappingURL=BaseNotification.d.ts.map