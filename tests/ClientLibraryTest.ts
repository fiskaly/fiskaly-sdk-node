import { ClientLibrary } from '../src/client/ClientLibrary';

test('Client Library Constructor Test', async () => {
    const lib = new ClientLibrary();
    expect(lib).not.toBeNull();
});

test('Client Library Version Request Test', async () => {
    const lib = new ClientLibrary();
    expect(lib).not.toBeNull();
    let result = await lib.request('version', {});
    expect(result).not.toBeNull();
});

