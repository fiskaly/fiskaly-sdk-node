import { FiskalyError } from "./";

export class FiskalyClientError extends FiskalyError {
    private readonly code: string;
    private readonly data: object;

    constructor(message: string, code: string, data: object) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.code = code;
        this.data = data;
    }

    public getData(): object {
        return this.data;
    }

    public getStatusCode(): string {
        return this.code;
    }
}
