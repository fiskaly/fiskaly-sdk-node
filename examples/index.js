require('dotenv').config( { path: '.env.example' });
const { FiskalyClient } = require('../lib');

const { FISKALY_SERVICE_URL, FISKALY_API_KEY, FISKALY_API_SECRET, FISKALY_BASE_URL } = process.env;

(async () => {
	try {
		// Client Setup
		const client = new FiskalyClient(FISKALY_SERVICE_URL);
		await client.createContext(FISKALY_API_KEY, FISKALY_API_SECRET, FISKALY_BASE_URL);

		const version = await client.getVersion();
		console.log("Version", version);

		const configParams = {
			debug_level: 4,
			debug_file: __dirname + '/../fiskaly.log',
			client_timeout: 5000,
			smaers_timeout: 2000,
		}
		const newConfig = await client.configure(configParams);
		console.log("New Client Configuration", newConfig);
	} catch (e) {
		// Handle Error
		console.error(e);
	}
})();
