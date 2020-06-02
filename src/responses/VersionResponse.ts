export class VersionResponse {
    private readonly clientVersion: string;
    private readonly clientSourceHash: string;
    private readonly clientCommitHash: string;
    private readonly smaersVersion: string;

    /**
     * VersionResponse constructor.
     * @param clientVersion
     * @param clientSourceHash
     * @param clientCommitHash
     * @param smaersVersion
     */
    constructor(clientVersion: string, clientSourceHash: string, clientCommitHash: string, smaersVersion: string) {
        this.clientVersion = clientVersion;
        this.clientSourceHash = clientSourceHash;
        this.clientCommitHash = clientCommitHash;
        this.smaersVersion = smaersVersion;
    }

    public getClientVersion(): string{
        return this.clientVersion;
    }

    public getClientSourceHash(): string{
        return this.clientSourceHash;
    }

    public getClientCommitHash(): string{
        return this.clientCommitHash;
    }

    public getSmaersVersion(): string{
        return this.smaersVersion;
    }

    public toString = () : string => {
        return VersionResponse.name + " [clientVersion: " + this.clientVersion + ", clientSourceHash: " + this.clientSourceHash + ", clientCommitHash: " + this.clientCommitHash + ", smaersVersion: " + this.smaersVersion + "]";
    }
}
