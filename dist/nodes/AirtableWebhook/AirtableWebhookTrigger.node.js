"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirtableWebhookTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class AirtableWebhookTrigger {
    constructor() {
        this.description = {
            displayName: 'Instant Airtable Trigger',
            name: 'airtableWebhookTrigger',
            icon: 'file:nodelogo.svg',
            group: ['trigger'],
            version: 1,
            description: 'Handle Airtable events via webhooks',
            defaults: {
                name: 'Airtable Webhook Trigger',
            },
            inputs: [],
            outputs: ["main"],
            credentials: [
                {
                    name: 'airtableApi',
                    required: true,
                },
            ],
            webhooks: [
                {
                    name: 'default',
                    httpMethod: 'POST',
                    responseMode: 'onReceived',
                    path: 'webhook',
                },
            ],
            properties: [
                {
                    displayName: 'Base ID',
                    name: 'baseId',
                    type: 'string',
                    default: '',
                    required: true,
                    description: 'The ID of the base to register the webhook for',
                },
                {
                    displayName: 'Data Types',
                    name: 'dataTypes',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Table Data',
                            value: 'tableData',
                            description: 'Record and cell value changes',
                        },
                        {
                            name: 'Table Fields',
                            value: 'tableFields',
                            description: 'Field changes',
                        },
                        {
                            name: 'Table Metadata',
                            value: 'tableMetadata',
                            description: 'Table name and description changes',
                        },
                    ],
                    default: ['tableData'],
                    required: true,
                    description: 'The types of data to watch for changes',
                },
                {
                    displayName: 'Record Change Scope',
                    name: 'recordChangeScope',
                    type: 'string',
                    default: '',
                    description: 'The ID of the table or view to watch for changes. Leave empty to watch the entire base.',
                },
                {
                    displayName: 'Advanced Options',
                    name: 'advancedOptions',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
                        {
                            displayName: 'Change Types',
                            name: 'changeTypes',
                            type: 'multiOptions',
                            options: [
                                {
                                    name: 'Add',
                                    value: 'add',
                                },
                                {
                                    name: 'Remove',
                                    value: 'remove',
                                },
                                {
                                    name: 'Update',
                                    value: 'update',
                                },
                            ],
                            default: [],
                            description: 'Only generate payloads for specific change types',
                        },
                        {
                            displayName: 'From Sources',
                            name: 'fromSources',
                            type: 'multiOptions',
                            options: [
                                {
                                    name: 'Anonymous User',
                                    value: 'anonymousUser',
                                },
                                {
                                    name: 'Automation',
                                    value: 'automation',
                                    description: 'Changes generated through an automation action',
                                },
                                {
                                    name: 'Client',
                                    value: 'client',
                                    description: 'Changes generated by a user through the web or mobile clients',
                                },
                                {
                                    name: 'Form Page Submission',
                                    value: 'formPageSubmission',
                                    description: 'Changes from interface form builders',
                                },
                                {
                                    name: 'Form Submission',
                                    value: 'formSubmission',
                                    description: 'Changes generated when a form view is submitted',
                                },
                                {
                                    name: 'Public API',
                                    value: 'publicApi',
                                    description: 'Changes generated through the Airtable API',
                                },
                                {
                                    name: 'Sync',
                                    value: 'sync',
                                    description: 'Changes generated through Airtable Sync',
                                },
                                {
                                    name: 'System',
                                    value: 'system',
                                    description: 'Changes generated by system events',
                                },
                                {
                                    name: 'Unknown',
                                    value: 'unknown',
                                },
                            ],
                            default: [],
                            description: 'Only generate payloads for changes from specific sources',
                        },
                        {
                            displayName: 'Include Cell Values In Field IDs',
                            name: 'includeCellValuesInFieldIds',
                            type: 'string',
                            default: '',
                            description: 'Comma-separated list of field IDs to include values for, regardless of whether they changed',
                        },
                        {
                            displayName: 'Include Previous Cell Values',
                            name: 'includePreviousCellValues',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to include the previous cell values in the webhook payload',
                        },
                        {
                            displayName: 'Include Previous Field Definitions',
                            name: 'includePreviousFieldDefinitions',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to include the previous field definitions in the webhook payload',
                        },
                        {
                            displayName: 'Watch Data In Field IDs',
                            name: 'watchDataInFieldIds',
                            type: 'string',
                            default: '',
                            description: 'Comma-separated list of field IDs to watch for changes',
                        },
                    ],
                },
            ],
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const webhookData = this.getWorkflowStaticData('node');
                    const baseId = this.getNodeParameter('baseId');
                    console.log('Checking if webhook exists, webhookId:', webhookData.webhookId);
                    if (webhookData.webhookId === undefined) {
                        return false;
                    }
                    try {
                        const endpoint = `/bases/${baseId}/webhooks`;
                        const response = await GenericFunctions_1.airtableApiRequest.call(this, 'GET', endpoint);
                        console.log('Webhooks list response:', JSON.stringify(response));
                        if (response.webhooks) {
                            for (const webhook of response.webhooks) {
                                if (webhook.id === webhookData.webhookId) {
                                    console.log('Webhook found, exists:', webhook);
                                    return true;
                                }
                            }
                        }
                        console.log('Webhook not found in list');
                        return false;
                    }
                    catch (error) {
                        console.log('Error checking webhook existence:', error);
                        return false;
                    }
                },
                async create() {
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const webhookData = this.getWorkflowStaticData('node');
                    const baseId = this.getNodeParameter('baseId');
                    const dataTypes = this.getNodeParameter('dataTypes', []);
                    const recordChangeScope = this.getNodeParameter('recordChangeScope', '');
                    const advancedOptions = this.getNodeParameter('advancedOptions', {});
                    console.log('Creating webhook with URL:', webhookUrl);
                    console.log('Base ID:', baseId);
                    console.log('Data Types:', dataTypes);
                    console.log('Record Change Scope:', recordChangeScope);
                    console.log('Advanced Options:', JSON.stringify(advancedOptions));
                    const specification = {
                        options: {
                            filters: {
                                dataTypes,
                            },
                        },
                    };
                    if (recordChangeScope) {
                        specification.options.filters = {
                            ...specification.options.filters,
                            recordChangeScope,
                        };
                    }
                    if (advancedOptions.changeTypes && Array.isArray(advancedOptions.changeTypes) && advancedOptions.changeTypes.length > 0) {
                        specification.options.filters = {
                            ...specification.options.filters,
                            changeTypes: advancedOptions.changeTypes,
                        };
                    }
                    if (advancedOptions.fromSources && Array.isArray(advancedOptions.fromSources) && advancedOptions.fromSources.length > 0) {
                        specification.options.filters = {
                            ...specification.options.filters,
                            fromSources: advancedOptions.fromSources,
                        };
                    }
                    if (advancedOptions.watchDataInFieldIds) {
                        const fieldIds = advancedOptions.watchDataInFieldIds.split(',').map(id => id.trim());
                        if (fieldIds.length > 0) {
                            specification.options.filters = {
                                ...specification.options.filters,
                                watchDataInFieldIds: fieldIds,
                            };
                        }
                    }
                    const includesOptions = {};
                    if (advancedOptions.includePreviousCellValues === true) {
                        includesOptions.includePreviousCellValues = true;
                    }
                    if (advancedOptions.includePreviousFieldDefinitions === true) {
                        includesOptions.includePreviousFieldDefinitions = true;
                    }
                    if (advancedOptions.includeCellValuesInFieldIds) {
                        const fieldIds = advancedOptions.includeCellValuesInFieldIds.split(',').map(id => id.trim());
                        if (fieldIds.length > 0) {
                            includesOptions.includeCellValuesInFieldIds = fieldIds;
                        }
                    }
                    if (Object.keys(includesOptions).length > 0) {
                        specification.options.includes = includesOptions;
                    }
                    const body = {
                        specification,
                    };
                    if (webhookUrl) {
                        body.notificationUrl = webhookUrl;
                    }
                    console.log('Webhook creation request body:', JSON.stringify(body, null, 2));
                    try {
                        const endpoint = `/bases/${baseId}/webhooks`;
                        const response = await GenericFunctions_1.airtableApiRequest.call(this, 'POST', endpoint, body);
                        console.log('Webhook creation response:', JSON.stringify(response, null, 2));
                        webhookData.webhookId = response.id;
                        webhookData.macSecretBase64 = response.macSecretBase64;
                        webhookData.baseId = baseId;
                        return true;
                    }
                    catch (error) {
                        console.log('Webhook creation error:', error);
                        throw error;
                    }
                },
                async delete() {
                    const webhookData = this.getWorkflowStaticData('node');
                    const baseId = webhookData.baseId || this.getNodeParameter('baseId');
                    if (webhookData.webhookId === undefined) {
                        return true;
                    }
                    try {
                        console.log('Deleting webhook with ID:', webhookData.webhookId);
                        const endpoint = `/bases/${baseId}/webhooks/${webhookData.webhookId}`;
                        await GenericFunctions_1.airtableApiRequest.call(this, 'DELETE', endpoint);
                        delete webhookData.webhookId;
                        delete webhookData.macSecretBase64;
                        delete webhookData.baseId;
                        return true;
                    }
                    catch (error) {
                        console.log('Webhook deletion error:', error);
                        return false;
                    }
                },
            },
        };
    }
    async webhook() {
        const webhookData = this.getWorkflowStaticData('node');
        const req = this.getRequestObject();
        const headerData = this.getHeaderData();
        const body = req.body;
        console.log('Received webhook payload:', JSON.stringify(body, null, 2));
        console.log('Headers:', JSON.stringify(headerData, null, 2));
        if (webhookData.macSecretBase64 && headerData['x-airtable-signature']) {
            const signature = headerData['x-airtable-signature'];
            const { createHmac } = await Promise.resolve().then(() => __importStar(require('crypto')));
            const computedSignature = createHmac('sha256', Buffer.from(webhookData.macSecretBase64, 'base64'))
                .update(req.rawBody)
                .digest('base64');
            console.log('Expected signature:', computedSignature);
            console.log('Received signature:', signature);
            if (signature !== computedSignature) {
                console.log('Invalid signature, ignoring webhook');
                return {};
            }
        }
        return {
            workflowData: [this.helpers.returnJsonArray(body)],
        };
    }
}
exports.AirtableWebhookTrigger = AirtableWebhookTrigger;
//# sourceMappingURL=AirtableWebhookTrigger.node.js.map