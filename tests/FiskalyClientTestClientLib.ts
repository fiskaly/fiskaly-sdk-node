import { FiskalyClient } from '../src/';
import { ClientConfiguration, VersionResponse, RequestResponse } from "../src/responses/";
import { FiskalyHttpError } from "../src/errors";

let FISKALY_SERVICE_URL: string, FISKALY_API_KEY: string, FISKALY_API_SECRET: string, FISKALY_BASE_URL: string;

beforeEach(() => {
    // @ts-ignore
    FISKALY_SERVICE_URL = null;
    FISKALY_API_KEY = 'test_9b92hretadf7nbl9gotci0188_development';
    FISKALY_API_SECRET= '2ZJ8CPxnwSSx1f9EcwgxmiXo5HauyigGEb1dJh9ZvdH';
    FISKALY_BASE_URL= 'https://kassensichv.io/api/v1';
})

test('Fiskaly Client Constructor', async () => {
    const client = new FiskalyClient(FISKALY_SERVICE_URL);
    expect(client).not.toBeNull();
});

test('Test get version request', async () => {
    const client = new FiskalyClient(FISKALY_SERVICE_URL);
    const version = await client.getVersion();
    expect(version).not.toBeNull();
    expect(version).toBeInstanceOf(VersionResponse);
});


test('Test create context request', async () => {
    const client = new FiskalyClient(FISKALY_SERVICE_URL);
    let initialContext = client.getContext();
    expect(initialContext).toBeUndefined();

    await client.createContext(FISKALY_API_KEY, FISKALY_API_SECRET, FISKALY_BASE_URL);
    const createdContext = client.getContext();

    expect(createdContext).not.toBeUndefined();
    expect(createdContext).not.toBeNull();
    expect(createdContext).not.toBe(initialContext);

    expect(createdContext).toBe(client.getContext());
});

test('Test configure method', async () => {
    const client = new FiskalyClient(FISKALY_SERVICE_URL);
    await client.createContext(FISKALY_API_KEY, FISKALY_API_SECRET, FISKALY_BASE_URL);

    const config = await client.getConfig();

    expect(config).not.toBeNull();
    expect(config).not.toBeUndefined();
    expect(config).toBeInstanceOf(ClientConfiguration);

    const configParams = {
        debug_level: 4,
        debug_file: __dirname + '/../fiskaly.log',
        client_timeout: 5000,
        smaers_timeout: 2000,
    }
    const newConfig = await client.configure(configParams);

    expect(newConfig).not.toBeNull();
    expect(newConfig).not.toBeUndefined();
    expect(newConfig).toBeInstanceOf(ClientConfiguration);

    expect(newConfig.getDebugLevel()).toBe(configParams.debug_level);
    expect(newConfig.getDebugFile()).toBe(configParams.debug_file);
    expect(newConfig.getClientTimeout()).toBe(configParams.client_timeout);
    expect(newConfig.getSmearsTimeout()).toBe(configParams.smaers_timeout);
});


test('Test request method', async () => {
    const client = new FiskalyClient(FISKALY_SERVICE_URL);
    await client.createContext(FISKALY_API_KEY, FISKALY_API_SECRET, FISKALY_BASE_URL);

    const requestParams = {
        method: 'PUT',
        path: '/tss/ecb75169-680f-48d1-93b2-52cc10abb9f/tx/9cbe6566-e24c-42ac-97fe-6a0112fb3c6',
        query: {
            last_revision: '0'
        },
        headers: {
            'Content-Type': 'application/json',
        },
        body: 'eyJzdGF0ZSI6ICJBQ1RJVkUiLCJjbGllbnRfaWQiOiAiYTYyNzgwYjAtMTFiYi00MThhLTk3MzYtZjQ3Y2E5NzVlNTE1In0='
    }

    await expect(client.request(requestParams)).rejects.toBeInstanceOf(FiskalyHttpError);
})