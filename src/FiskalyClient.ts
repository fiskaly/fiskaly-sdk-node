import * as jayson from 'jayson/promise';
import { ClientConfiguration, VersionResponse, RequestResponse } from './responses';
import { FiskalyErrorHandler, FiskalyError } from "./errors";
import { ConfigureMethodParams, RequestMethodParams } from "./interfaces";
import { ClientLibrary } from "./client/ClientLibrary";
import {JSONRPCResultLike} from "jayson/promise";

export class FiskalyClient {
    private readonly SDK_VERSION = '1.1.600';
    private context: string | undefined;
    private readonly doRequestFn: OmitThisParameter<(method: string, params: object) => Promise<JSONRPCResultLike> | null> = () => null;
    private readonly allowedMethods = ['create-context', 'version', 'config', 'request', 'echo'];

    /**
     * Fiskaly Client Constructor.
     * If fiskalyServiceUrl parameter not provided, the client library will be loaded from 'client' folder
     * @param {string} fiskalyServiceUrl | optional
     */
    constructor(fiskalyServiceUrl: string) {
        if (!fiskalyServiceUrl) {
            try {
                const lib = new ClientLibrary();
                this.doRequest = lib.request.bind(lib);
            } catch (e) {
                throw new FiskalyError("fiskalyServiceUrl must be provided");
            }
        } else {
            // @ts-ignore
            const rpc = jayson.Client.http(fiskalyServiceUrl);
            this.doRequest = rpc.request.bind(rpc);
        }
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
        /** Check if error exists */
        if (response.error != null) {
            throw FiskalyErrorHandler.throwError(response);
        }
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
        /** Check if error exists */
        if (response.error != null) {
            throw FiskalyErrorHandler.throwError(response);
        }

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
