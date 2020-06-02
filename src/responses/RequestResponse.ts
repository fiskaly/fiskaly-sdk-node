export class RequestResponse {
    private readonly response: object;
    private readonly context: string;

    /**
     * RequestResponse constructor.
     * @param response
     * @param context
     */
    constructor(response: object, context: string) {
        this.response = response;
        this.context = context;
    }

    public getResponse(): object {
        return this.response;
    }

    public getContext(): string {
        return this.context;
    }

    public toString = () : string => {
        return RequestResponse.name + " [context: " + this.context + ", response: " + this.response + "]";
    }
}
