// @ts-ignore
import * as ffi from "ffi-napi";
// @ts-ignore
import * as ref from "ref-napi";
import {FiskalyError} from "../errors";
import * as path from "path";
import { version } from '../../package.json';

export class ClientLibrary {
    private readonly LIB_PREFIX: string = "com.fiskaly.client";
    private readonly LIB_VERSION: string = 'v' + version.slice(0, -2) + '00';

    private library: ffi.Library = null;

    /**
     * Client Library Constructor.
     */
    constructor() {
        try {
            this.library = ffi.Library(path.join(__dirname, '/' + this.getLibraryName()), {
                _fiskaly_client_invoke: ['char *', ['char *']],
                _fiskaly_client_free: ['void', ['char *']],
            })
        } catch (e) {
            throw new FiskalyError(e);
        }
    }

    /**
     * Client JSON RPC Request method
     * @param {string} method
     * @param {object} params
     */
    public async request(method: string, params: object): Promise<object> {
        let requestCStr = ref.allocCString(JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method,
            params
        }));

        // @ts-ignore
        requestCStr = this.library._fiskaly_client_invoke(requestCStr);

        try {
            return JSON.parse(requestCStr.readCString());
        } catch (e) {
            throw new FiskalyError('Wrong JSON Response: ' + requestCStr);
        }
    }

    /**
     * @deprecated - Not tested
     * @param {string} method
     * @param {object} params
     */
    public async requestAsync(method: string, params: object): Promise<object> {
        return new Promise(async (resolve, reject) => {
            let requestCStr = ref.allocCString(JSON.stringify({
                jsonrpc: '2.0',
                id: Date.now(),
                method,
                params
            }));

            // @ts-ignore
            this.library._fiskaly_client_invoke.async(requestCStr, (err, requestCStr) => {
                if (err) return reject(err)
                try {
                    const { result, error } = JSON.parse(requestCStr.readCString());

                    // Call Free Client Method
                    this.library._fiskaly_client_free(requestCStr);

                    // Reject error
                    if (error != null) {
                        const { message, ...props } = error
                        return reject(Object.assign(new Error(message), props))
                    }

                    return resolve(result);
                } catch (e) {
                    throw new FiskalyError('Wrong JSON Response: ' + requestCStr);
                }
            });
        });
    }

    /**
     * Get Library file name
     * @return {string}
     */
    private getLibraryName(): string {
        return `${this.LIB_PREFIX}-${ClientLibrary.osPlatform()}-${ClientLibrary.osArch()}-${this.LIB_VERSION}.${ClientLibrary.getLibraryExtension()}`;
    }

    /**
     * Get Library Extension based on operating system
     * @return {string}
     */
    private static getLibraryExtension(): string {
        const platform = ClientLibrary.osPlatform();
        let extension = null;

        switch (platform) {
            case 'windows':
                extension = "dll";
                break;
            case 'linux':
                extension = "so";
                break;
            case 'darwin':
                extension = "dylib";
                break;
            default:
                throw new FiskalyError("OS type not supported: " + platform);
        }

        return extension;
    }

    /**
     * Get OS name for the library name
     * @return {string}
     */
    private static osPlatform(): string {
        if (process.platform === 'win32') {
            return 'windows'
        } else {
            return process.platform
        }
    }

    /**
     * Get OS Arch parameter for the library name
     * @return {string}
     */
    private static osArch(): string {
        if (process.arch === 'x32') {
            return '386'
        } else if (process.arch === 'x64') {
            return 'amd64'
        } else {
            return process.arch
        }
    }
}
