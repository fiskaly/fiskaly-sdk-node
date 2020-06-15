export class SelfTestResponse {
    private readonly proxy: string;
    private readonly backend: string;
    private readonly smaers: string;

    /**
     * SelfTestResponse constructor.
     * @param proxy
     * @param backend
     * @param smaers
     */
    constructor(proxy: string, backend: string, smaers: string) {
        this.proxy = proxy;
        this.backend = backend;
        this.smaers = smaers;
    }

    public getProxy(): string{
        return this.proxy;
    }

    public getBackend(): string{
        return this.backend;
    }

    public getSmaers(): string{
        return this.smaers;
    }

    public toString = () : string => {
        return SelfTestResponse.name + " [proxy: " + this.proxy + ", backend: " + this.backend + ", smaers: " + this.smaers + "]";
    }
}
