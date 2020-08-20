# fiskaly SDK for Node.js

The fiskaly SDK includes an HTTP client that is needed<sup>[1](#fn1)</sup> for accessing the [kassensichv.io](https://kassensichv.io) API that implements a cloud-based, virtual **CTSS** (Certified Technical Security System) / **TSE** (Technische Sicherheitseinrichtung) as defined by the German **KassenSichV** ([Kassen­sich­er­ungsver­ord­nung](https://www.bundesfinanzministerium.de/Content/DE/Downloads/Gesetze/2017-10-06-KassenSichV.pdf)).

## Supported Versions

* Node 8.0+

## Features

- [X] Automatic authentication handling (fetch/refresh JWT and re-authenticate upon 401 errors).
- [X] Automatic retries on failures (server errors or network timeouts/issues).
- [ ] Automatic JSON parsing and serialization of request and response bodies.
- [X] Future: [<a name="fn1">1</a>] compliance regarding [BSI CC-PP-0105-2019](https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Zertifizierung/Reporte/ReportePP/pp0105b_pdf.pdf?__blob=publicationFile&v=7) which mandates a locally executed SMA component for creating signed log messages.
- [ ] Future: Automatic offline-handling (collection and documentation according to [Anwendungserlass zu § 146a AO](https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Weitere_Steuerthemen/Abgabenordnung/AO-Anwendungserlass/2019-06-17-einfuehrung-paragraf-146a-AO-anwendungserlass-zu-paragraf-146a-AO.pdf?__blob=publicationFile&v=1))

## Integration

### NPM

The Node.js SDK is available for a download via [NPM](https://npmjs.com/).

[Package Repository](https://npmjs.org/package/fiskaly-sdk-node).

Simply execute this command from the shell in your project directory:

```bash
$ npm install fiskaly-sdk-node --save
```

Or you can manually add the package to your `package.json` file:

```json
"dependencies": {
  "fiskaly-sdk-node": "*"
}
```
then run
```bash
$ npm install
```

Finally, be sure to include the sdk in your code:

```javascript
const { FiskalyClient } = require('fiskaly-sdk-node');
```

### Service

Additionally, to the SDK, you'll also need the fiskaly service. Follow these steps to integrate it into your project:

1. Go to [https://developer.fiskaly.com/downloads#service](https://developer.fiskaly.com/downloads#service)
2. Download the appropriate service build for your platform
3. Start the service

### Client

Additionally to the service, Node SDK, support also fiskaly client. 
The client library is used if your constructor parameter "fiskalyServiceUrl" is not provided.

Follow these steps to integrate it into your project:
1. Go to [https://developer.fiskaly.com/downloads#client](https://developer.fiskaly.com/downloads/#client)
2. Download the appropriate client library for your platform
3. Move it to node_modules/fiskaly-sdk-node/lib/client/ directory

## SDK Usage

### Demo

```javascript
// Environment variables
const { FISKALY_SERVICE_URL, FISKALY_API_KEY, FISKALY_API_SECRET, FISKALY_BASE_URL } = process.env;

try {
  // SDK Setup
  const client = new FiskalyClient(FISKALY_SERVICE_URL);
  await client.createContext(FISKALY_API_KEY, FISKALY_API_SECRET, FISKALY_BASE_URL);

  const version = await client.getVersion();
  console.log("Version", version);
} catch (e) {
  // Handle Error
  console.error(e);
}
```

### Client Configuration

The SDK is built on the [fiskaly Client](https://developer.fiskaly.com/en/docs/client-documentation) which can be [configured](https://developer.fiskaly.com/en/docs/client-documentation#configuration) through the SDK.

A reason why you would do this, is to enable the [debug mode](https://developer.fiskaly.com/en/docs/client-documentation#debug-mode).

#### Enabling the debug mode

The following code snippet demonstrates how to enable the debug mode in the client.

```javascript
try {
  const configParams = {
    debug_level: 3,
    debug_file: __dirname + '/../fiskaly.log',
    client_timeout: 5000,
    smaers_timeout: 2000,
  }
  const newConfig = await client.configure(configParams);
} catch (e) {
  // Handle Error
  console.error(e);
}
````

## Related

* [fiskaly.com](https://fiskaly.com)
* [dashboard.fiskaly.com](https://dashboard.fiskaly.com)
* [kassensichv.io](https://kassensichv.io)
* [kassensichv.net](https://kassensichv.net)
