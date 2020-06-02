import { FiskalyError } from "./";

export class FiskalyTimeoutError extends FiskalyError {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
