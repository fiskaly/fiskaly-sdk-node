import { FiskalyClient } from '../src/';
import { ClientConfiguration, VersionResponse, RequestResponse } from "../src/responses/";
// @ts-ignore
const uuid = require('uuid/v4');
import * as dotenv from 'dotenv';
dotenv.config()

let FISKALY_SERVICE_URL: string, FISKALY_API_KEY: string, FISKALY_API_SECRET: string, FISKALY_BASE_URL: string, MANAGEMENT_BASE_URL: string, EMAIL: string, PASSWORD: string;

beforeEach(() => {
    FISKALY_SERVICE_URL = process.env.FISKALY_SERVICE_URL || '';
    FISKALY_API_KEY = process.env.FISKALY_API_KEY || '';
    FISKALY_API_SECRET= process.env.FISKALY_API_SECRET || '';
    FISKALY_BASE_URL = process.env.FISKALY_BASE_URL || '';
    MANAGEMENT_BASE_URL = process.env.MANAGEMENT_BASE_URL || '';
    EMAIL = process.env.EMAIL || '';
    PASSWORD = process.env.PASSWORD || '';
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
        debug_level: 3,
        debug_file: '-',
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

    const tssUUID = uuid();

    const requestParams = {
        method: 'PUT',
        path: '/tss/' + tssUUID,
        body: 'eyJkZXNjcmlwdGlvbiI6ICJjdXN0b20gZGVzY3JpcHRpb24iLCAic3RhdGUiOiAiSU5JVElBTElaRUQifQ=='
    }

    const response = await client.request(requestParams);
    expect(response).not.toBeNull();
    expect(response).not.toBeUndefined();
    expect(response).toBeInstanceOf(RequestResponse);
})

test('Test query array', async () => {
    const client = new FiskalyClient(FISKALY_SERVICE_URL);
    await client.createContext(FISKALY_API_KEY, FISKALY_API_SECRET, FISKALY_BASE_URL);

    const requestParams = {
        method: 'GET',
        path: '/tss',
        query: {
            states: ["UNINITIALIZED"]
        }
    }

    const response = await client.request(requestParams);
    expect(response).not.toBeNull();
    expect(response).not.toBeUndefined();
    expect(response).toBeInstanceOf(RequestResponse);

})

test('Test Management API with email and password', async () => {
    const client = new FiskalyClient(FISKALY_SERVICE_URL);
    
    await client.createContext('', '', MANAGEMENT_BASE_URL, EMAIL, PASSWORD);
    const requestParams = {
        method: 'GET',
        path: '/organizations'
    }

    const response = await client.request(requestParams);
    expect(response).not.toBeNull();
    expect(response).not.toBeUndefined();
    expect(response).toBeInstanceOf(RequestResponse);

})

test('Base64 Encoding for Body', async () => {
    const client = new FiskalyClient(FISKALY_SERVICE_URL);

    await client.createContext(FISKALY_API_KEY, FISKALY_API_SECRET, FISKALY_BASE_URL);

    const jsonBody = {
        state: 'UNINITIALIZED',
        description: 'NodeJS Test TSS'
    }

    const body = Buffer.from(JSON.stringify(jsonBody)).toString('base64');

    const tssUUID = uuid();

    const requestParams = {
        method: 'PUT',
        path: '/tss/' + tssUUID,
        body: body
    }

    const response = await client.request(requestParams);
    expect(response).not.toBeNull();
    expect(response).not.toBeUndefined();
    expect(response).toBeInstanceOf(RequestResponse);

})
