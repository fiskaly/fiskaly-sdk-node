import * as jayson from 'jayson/promise';
import { ClientConfiguration, VersionResponse, RequestResponse } from './responses';
import { FiskalyErrorHandler, FiskalyError } from "./errors";
import { ConfigureMethodParams, RequestMethodParams } from "./interfaces";

export class FiskalyClient {
    private readonly SDK_VERSION = '1.1.600';
    private context: string | undefined;
    private readonly jsonRPC: jayson.Client;
    private readonly allowedMethods = ['create-context', 'version', 'config', 'request', 'echo'];

    /**
     * Fiskaly Client Constructor.
     * @param {string} fiskalyServiceUrl
     */
    constructor(fiskalyServiceUrl: string) {
        if (!fiskalyServiceUrl) {
            throw new FiskalyError("fiskalyServiceUrl must be provided");
        }
        // @ts-ignore
        this.jsonRPC = jayson.Client.http(fiskalyServiceUrl);
    }

    /**
     * Send JSON RPC Request to Client
     * @param {string} method
     * @param {object} params
     */
    private async doRequest(method: string, params: object) {
        if(!this.allowedMethods.includes(method)) {
            throw new FiskalyError("Invalid method parameter");
        }
        const response = await this.jsonRPC.request(method, params);
        /** Check if error exists */
        if (response.error != null) {
            throw FiskalyErrorHandler.throwError(response);
        }
        return response
    }

    /**
     * Create context
     * @param {string} apiKey
     * @param {string} apiSecret
     * @param {string} baseUrl
     * @return Promise
     */
    public async createContext (apiKey: string, apiSecret: string, baseUrl: string): Promise<any> {
        if (!apiKey) {
            throw new FiskalyError("apiKey must be provided");
        }
        if (!apiSecret) {
            throw new FiskalyError("apiSecret must be provided");
        }
        if (!baseUrl) {
            throw new FiskalyError("baseUrl must be provided");
        }
        const contextParams = {
            'base_url': baseUrl,
            'api_key': apiKey,
            'api_secret': apiSecret,
            'sdk_version': this.SDK_VERSION
        };
        const response = await this.doRequest('create-context', contextParams);

        /** Update context */
        this.updateContext(response.result.context);
    }

    /**
     * Update Context
     * @param {string} context - New base64 encoded context
     */
    private updateContext (context: string): void {
        this.context = context;
    }

    /**
     * Get Context
     * @return {string}
     */
    public getContext (): string | undefined {
        return this.context;
    }

    /**
     * Get Version - information about the currently used client and SMAERS.
     * @return Promise
     */
    public async getVersion(): Promise<VersionResponse> {
        const response = await this.doRequest('version', {});

        const client = response.result.client;
        const smaers = response.result.smaers;

        return new VersionResponse(client.version, client.source_hash, client.commit_hash, smaers.version);
    }

    /**
     * Get fiskaly client configuration
     * @return Promise
     */
    public async getConfig (): Promise<ClientConfiguration> {
        const params = {
            context: this.context
        };
        const response = await this.doRequest('config', params);

        const config = response.result.config;
        return new ClientConfiguration(config.debug_level, config.debug_file, config.client_timeout, config.smaers_timeout);
    }

    /**
     * Get fiskaly client configuration
     * @param {ConfigureMethodParams} configParams
     */
    public async configure (configParams: ConfigureMethodParams): Promise<ClientConfiguration> {
        const params = {
            config: configParams,
            context: this.context
        };
        const response = await this.doRequest('config', params);

        /** Update context */
        this.updateContext(response.result.context);

        const config = response.result.config;
        return new ClientConfiguration(config.debug_level, config.debug_file, config.client_timeout, config.smaers_timeout);
    }

    /**
     * Execute the request
     * @param {RequestMethodParams} requestParams
     */
    public async request (requestParams: RequestMethodParams): Promise<RequestResponse> {
        const params = {
            request: requestParams,
            context: this.context
        };
        const response = await this.doRequest('request', params);

        const requestResponse = new RequestResponse(response.result.response, response.result.context);

        /** Update context */
        this.updateContext(requestResponse.getContext());

        return requestResponse;
    }
}
