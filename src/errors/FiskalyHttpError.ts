import { FiskalyError } from './'

export class FiskalyHttpError extends FiskalyError {
    private readonly error: string;
    private readonly code: string;
    private readonly status: string;
    private readonly requestId: string;

    constructor(message: string, code: string, error: string, status: string, requestId: string) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);

        this.code = code;
        this.error = error;
        this.status = status;
        this.requestId = requestId;
    }

    public getError(): string {
        return this.error;
    }

    public getStatusCode(): string {
        return this.code;
    }

    public getStatus(): string {
        return this.status;
    }

    public getRequestId(): string {
        return this.requestId;
    }

    public __toString() {
        return FiskalyHttpError.name + ": [{$this.code}]: {$this.message}, Status: " + this.status + " Error: " + this.error + " RequestId: " + this.requestId + "\n";
    }
}
