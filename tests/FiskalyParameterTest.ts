import { FiskalyClient } from '../src/';
import { FiskalyError } from "../src/errors";

let FISKALY_SERVICE_URL: string, FISKALY_API_KEY: string, FISKALY_API_SECRET: string, FISKALY_BASE_URL: string;

beforeEach(() => {
    FISKALY_SERVICE_URL = 'http://localhost:8080/invoke';
    FISKALY_API_KEY = 'test_9b92hretadf7nbl9gotci0188_development';
    FISKALY_API_SECRET= '2ZJ8CPxnwSSx1f9EcwgxmiXo5HauyigGEb1dJh9ZvdH';
    FISKALY_BASE_URL= 'https://kassensichv.io/api/v1';
})

test('Constructor parameter test', async () => {
    let setup = function () {
        const client = new FiskalyClient('');
    }
    expect(setup).toThrow('fiskalyServiceUrl must be provided');
});

test('Create context method apiKey parameter test', async () => {
    const client = new FiskalyClient(FISKALY_SERVICE_URL);

    await expect(async () => {
        return await client.createContext('', FISKALY_API_SECRET, FISKALY_BASE_URL);
    }).rejects.toStrictEqual(new FiskalyError('apiKey must be provided'));
});

test('Create context method apiSecret parameter test', async () => {
    const client = new FiskalyClient(FISKALY_SERVICE_URL);

    await expect(async () => {
        return await client.createContext(FISKALY_API_KEY, '', FISKALY_BASE_URL);
    }).rejects.toStrictEqual(new FiskalyError('apiSecret must be provided'));

    await expect(async () => {
        return await client.createContext(FISKALY_API_KEY, FISKALY_API_SECRET, '');
    }).rejects.toStrictEqual(new FiskalyError('baseUrl must be provided'));
});

test('Create context method baseUrl parameter test', async () => {
    const client = new FiskalyClient(FISKALY_SERVICE_URL);

    await expect(async () => {
        return await client.createContext(FISKALY_API_KEY, FISKALY_API_SECRET, '');
    }).rejects.toStrictEqual(new FiskalyError('baseUrl must be provided'));
});
