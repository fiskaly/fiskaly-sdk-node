import * as jayson from 'jayson/promise';
import { ClientConfiguration, VersionResponse, RequestResponse, SelfTestResponse } from './responses';
import { FiskalyErrorHandler, FiskalyError } from "./errors";
import { ConfigureMethodParams, RequestMethodParams } from "./interfaces";
import { ClientLibrary } from "./client/ClientLibrary";
import {JSONRPCResultLike} from "jayson/promise";
import * as path from "path";
import * as fs from "fs";


const pkg = fs.readFileSync(path.join(__dirname, '../package.json'), { encoding: "utf-8" });
const { version } = JSON.parse(pkg);

export class FiskalyClient {
    private context: string | undefined;
    private readonly doRequestFn: OmitThisParameter<(method: string, params: object) => Promise<JSONRPCResultLike> | null> = () => null;
    private readonly allowedMethods = ['create-context', 'version', 'self-test', 'config', 'request', 'echo'];

    /**
     * Fiskaly Client Constructor.
     * If fiskalyServiceUrl parameter not provided, the client library will be loaded from 'client' folder
     * @param {string} fiskalyServiceUrl | optional
     * @param {(method: string, params: object) => Promise<JSONRPCResultLike>} requestFunction | optional
     */
    constructor(fiskalyServiceUrl?: string, fiskalyLibraryPath?: string, requestFunction?: (method: string, params: object) => Promise<JSONRPCResultLike>) {
        if (requestFunction) {
            this.doRequestFn = requestFunction;
        } else if (!fiskalyServiceUrl) {
            try {
                const lib = new ClientLibrary(fiskalyLibraryPath);
                this.doRequestFn = lib.request.bind(lib);
            } catch (e) {
                throw new FiskalyError("Could not load fiskaly Client Library. Make sure that the library is present or use the fiskaly Service.");
            }
        } else {
            // @ts-ignore
            const rpc = jayson.Client.http(fiskalyServiceUrl);
            this.doRequestFn = rpc.request.bind(rpc);
        }
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
        const response = await this.doRequestFn(method, params);
        /** Check if error exists */
        if (response.error != null) {
            throw FiskalyErrorHandler.throwError(response);
        }
        return response
    }

    /**
     * Create context
     * @param {string} apiKey | optional
     * @param {string} apiSecret | optional
     * @param {string} baseUrl | optional
     * @param {string} email | optional
     * @param {string} password | optional
     * @param {string} organizationId | optional
     * @param {string} environment | optional
     * @return Promise
     */
    public async createContext (apiKey?: string, apiSecret?: string, baseUrl?: string, email?: string, password?: string, organizationId?: string, environment?: string): Promise<any> {
        if(!email) {
            if (!apiKey) {
                throw new FiskalyError("apiKey must be provided");
            }
            if (!apiSecret) {
                throw new FiskalyError("apiSecret must be provided");
            }
        } else {
            if (!password) {
                throw new FiskalyError("password must be provided in combination with email")
            }
        }
        if (!baseUrl) {
            throw new FiskalyError("baseUrl must be provided");
        }

        const contextParams = {
            'base_url': baseUrl,
            'api_key': apiKey,
            'api_secret': apiSecret,
            'email': email || '',
            'password': password || '',
            'organization_id': organizationId || '',
            'environment': environment || '',
            'sdk_version': version
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
        const client = response.result.client;
        const smaers = response.result.smaers;

        return new VersionResponse(client.version, client.source_hash, client.commit_hash, smaers.version);
    }

    /**
     * SelfTest - checks for connection to the backend and proxies
     * @return Promise
     */
    public async selfTest(): Promise<SelfTestResponse> {
        const params = {
            context: this.context
        };
        const response = await this.doRequest('self-test', params);

        const proxy = response.result.proxy;
        const backend = response.result.backend;
        const smaers = response.result.smaers;

        return new SelfTestResponse(proxy, backend, smaers);
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
        return new ClientConfiguration(config.debug_level, config.debug_file, config.client_timeout, config.smaers_timeout, config.http_proxy);
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
        return new ClientConfiguration(config.debug_level, config.debug_file, config.client_timeout, config.smaers_timeout, config.http_proxy);
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
