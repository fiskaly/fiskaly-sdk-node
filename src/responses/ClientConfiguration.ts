export class ClientConfiguration {
    /** @var */
    private readonly debugLevel: number;
    /** @var */
    private readonly debugFile: string;
    /** @var */
    private readonly clientTimeout: number;
    /** @var */
    private readonly smaersTimeout: number;
    /** @var */
    private readonly httpProxy: string;

    /**
     * ClientConfiguration constructor.
     * @param debugLevel
     * @param debugFile
     * @param clientTimeout
     * @param smaersTimeout
     * @param httpProxy
     */
    constructor(debugLevel: number, debugFile: string, clientTimeout: number, smaersTimeout: number, httpProxy: string) {
        this.debugLevel = debugLevel;
        this.debugFile = debugFile;
        this.clientTimeout = clientTimeout;
        this.smaersTimeout = smaersTimeout;
        this.httpProxy = httpProxy;
    }


    public getDebugLevel(): number {
        return this.debugLevel;
    }

    public getDebugFile(): string {
        return this.debugFile;
    }

    public getClientTimeout(): number {
        return this.clientTimeout;
    }

    public getSmearsTimeout(): number {
        return this.smaersTimeout;
    }

    public getHttpProxy(): string {
        return this.httpProxy;
    }

    public toString = () : string => {
        return ClientConfiguration.name + " [debugLevel: " + this.debugLevel + ", debugFile: " + this.debugFile + ", clientTimeout: " + this.clientTimeout + ", smaersTimeout: " + this.smaersTimeout +  ", httpProxy: " + this.httpProxy + "]";
    }
}
