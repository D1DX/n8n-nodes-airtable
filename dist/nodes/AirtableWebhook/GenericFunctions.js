"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.airtableApiRequest = airtableApiRequest;
const n8n_workflow_1 = require("n8n-workflow");
async function airtableApiRequest(method, endpoint, body = {}, qs = {}) {
    const credentials = await this.getCredentials('airtableApi');
    const httpMethod = method.toUpperCase();
    const options = {
        method: httpMethod,
        headers: {
            'Authorization': `Bearer ${credentials.apiKey}`,
            'Content-Type': 'application/json',
        },
        body: Object.keys(body).length ? JSON.stringify(body) : undefined,
        qs,
        url: `https://api.airtable.com/v0${endpoint}`,
        json: true,
    };
    console.log(`Making request to: ${options.url}`);
    console.log(`With method: ${httpMethod}`);
    console.log(`With body: ${options.body}`);
    console.log(`With query: ${JSON.stringify(qs)}`);
    try {
        const response = await this.helpers.httpRequest(options);
        console.log(`Response received: ${JSON.stringify(response)}`);
        return response;
    }
    catch (error) {
        console.log(`Request error: ${JSON.stringify(error)}`);
        throw new n8n_workflow_1.NodeApiError(this.getNode(), error);
    }
}
//# sourceMappingURL=GenericFunctions.js.map