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
                    description: 'The ID of the Airtable base to watch (e.g. appXXXXXXXXXXXXXX)',
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
                            description: 'Field schema changes',
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
                    displayName: 'Change Types',
                    name: 'changeTypes',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Add',
                            value: 'add',
                            description: 'Object was created',
                        },
                        {
                            name: 'Remove',
                            value: 'remove',
                            description: 'Object was deleted',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Object was modified',
                        },
                    ],
                    default: [],
                    description: 'Only trigger for these change types. Leave empty to trigger for all types.',
                },
                {
                    displayName: 'Record Change Scope',
                    name: 'recordChangeScope',
                    type: 'string',
                    default: '',
                    description: 'Only watch for changes in this table or view (TableId or ViewId). Leave empty to watch the entire base.',
                },
                {
                    displayName: 'Advanced Options',
                    name: 'advancedOptions',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    options: [
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
                                    description: 'Changes generated through an Airtable automation',
                                },
                                {
                                    name: 'Client',
                                    value: 'client',
                                    description: 'Changes by a user through the web or mobile client',
                                },
                                {
                                    name: 'Form Page Submission',
                                    value: 'formPageSubmission',
                                    description: 'Changes from interface form builder page submissions',
                                },
                                {
                                    name: 'Form Submission',
                                    value: 'formSubmission',
                                    description: 'Changes from form view submissions',
                                },
                                {
                                    name: 'Public API',
                                    value: 'publicApi',
                                    description: 'Changes via the Airtable REST API',
                                },
                                {
                                    name: 'Sync',
                                    value: 'sync',
                                    description: 'Changes from Airtable Sync',
                                },
                                {
                                    name: 'System',
                                    value: 'system',
                                    description: 'Changes from system events (e.g. formula recalculation)',
                                },
                                {
                                    name: 'Unknown',
                                    value: 'unknown',
                                },
                            ],
                            default: [],
                            description: 'Only trigger for changes from these sources. Leave empty for all sources.',
                        },
                        {
                            displayName: 'Form Submission View ID',
                            name: 'formSubmissionViewId',
                            type: 'string',
                            default: '',
                            description: 'Filter form view submissions to this specific ViewId (only applies when "Form Submission" is selected in From Sources)',
                        },
                        {
                            displayName: 'Form Page Submission Page ID',
                            name: 'formPageSubmissionPageId',
                            type: 'string',
                            default: '',
                            description: 'Filter interface page submissions to this specific PageId (only applies when "Form Page Submission" is selected in From Sources)',
                        },
                        {
                            displayName: 'Watch Data In Field IDs',
                            name: 'watchDataInFieldIds',
                            type: 'string',
                            default: '',
                            description: 'Only trigger when cell values in these fields change. Comma-separated list of field IDs. Warning: if any listed field is deleted, the webhook enters an error state.',
                        },
                        {
                            displayName: 'Watch Schemas Of Field IDs',
                            name: 'watchSchemasOfFieldIds',
                            type: 'string',
                            default: '',
                            description: 'Only trigger when the schema (name, type) of these fields changes. Comma-separated list of field IDs. Warning: if any listed field is deleted, the webhook enters an error state.',
                        },
                        {
                            displayName: 'Include Cell Values',
                            name: 'includeCellValuesInFieldIds',
                            type: 'options',
                            options: [
                                {
                                    name: 'None',
                                    value: 'none',
                                    description: 'Only include changed fields (default)',
                                },
                                {
                                    name: 'All Fields',
                                    value: 'all',
                                    description: 'Include all field values in every payload',
                                },
                                {
                                    name: 'Specific Fields',
                                    value: 'specific',
                                    description: 'Include specific field values regardless of whether they changed',
                                },
                            ],
                            default: 'none',
                            description: 'Include cell values for fields even if they did not change',
                        },
                        {
                            displayName: 'Include Cell Values Field IDs',
                            name: 'includeCellValuesFieldIds',
                            type: 'string',
                            default: '',
                            displayOptions: {
                                show: {
                                    includeCellValuesInFieldIds: ['specific'],
                                },
                            },
                            description: 'Comma-separated list of field IDs to include in every payload',
                        },
                        {
                            displayName: 'Include Previous Cell Values',
                            name: 'includePreviousCellValues',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to include the previous cell value alongside the current in record change payloads',
                        },
                        {
                            displayName: 'Include Previous Field Definitions',
                            name: 'includePreviousFieldDefinitions',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to include the previous field definition alongside the current in field change payloads',
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
                    if (webhookData.webhookId === undefined) {
                        return false;
                    }
                    try {
                        const endpoint = `/bases/${baseId}/webhooks`;
                        const response = await GenericFunctions_1.airtableApiRequest.call(this, 'GET', endpoint);
                        if (response.webhooks) {
                            for (const webhook of response.webhooks) {
                                if (webhook.id === webhookData.webhookId) {
                                    return true;
                                }
                            }
                        }
                        return false;
                    }
                    catch (error) {
                        return false;
                    }
                },
                async create() {
                    const webhookUrl = this.getNodeWebhookUrl('default');
                    const webhookData = this.getWorkflowStaticData('node');
                    const baseId = this.getNodeParameter('baseId');
                    const dataTypes = this.getNodeParameter('dataTypes', []);
                    const changeTypes = this.getNodeParameter('changeTypes', []);
                    const recordChangeScope = this.getNodeParameter('recordChangeScope', '');
                    const advancedOptions = this.getNodeParameter('advancedOptions', {});
                    const filters = { dataTypes };
                    if (changeTypes.length > 0) {
                        filters.changeTypes = changeTypes;
                    }
                    if (recordChangeScope) {
                        filters.recordChangeScope = recordChangeScope;
                    }
                    if (advancedOptions.fromSources && advancedOptions.fromSources.length > 0) {
                        filters.fromSources = advancedOptions.fromSources;
                    }
                    // sourceOptions
                    const sourceOptions = {};
                    if (advancedOptions.formSubmissionViewId) {
                        sourceOptions.formSubmission = { viewId: advancedOptions.formSubmissionViewId };
                    }
                    if (advancedOptions.formPageSubmissionPageId) {
                        sourceOptions.formPageSubmission = { pageId: advancedOptions.formPageSubmissionPageId };
                    }
                    if (Object.keys(sourceOptions).length > 0) {
                        filters.sourceOptions = sourceOptions;
                    }
                    if (advancedOptions.watchDataInFieldIds) {
                        const fieldIds = advancedOptions.watchDataInFieldIds.split(',').map(id => id.trim()).filter(Boolean);
                        if (fieldIds.length > 0) {
                            filters.watchDataInFieldIds = fieldIds;
                        }
                    }
                    if (advancedOptions.watchSchemasOfFieldIds) {
                        const fieldIds = advancedOptions.watchSchemasOfFieldIds.split(',').map(id => id.trim()).filter(Boolean);
                        if (fieldIds.length > 0) {
                            filters.watchSchemasOfFieldIds = fieldIds;
                        }
                    }
                    const includes = {};
                    const includeCellValuesMode = advancedOptions.includeCellValuesInFieldIds || 'none';
                    if (includeCellValuesMode === 'all') {
                        includes.includeCellValuesInFieldIds = 'all';
                    }
                    else if (includeCellValuesMode === 'specific' && advancedOptions.includeCellValuesFieldIds) {
                        const fieldIds = advancedOptions.includeCellValuesFieldIds.split(',').map(id => id.trim()).filter(Boolean);
                        if (fieldIds.length > 0) {
                            includes.includeCellValuesInFieldIds = fieldIds;
                        }
                    }
                    if (advancedOptions.includePreviousCellValues === true) {
                        includes.includePreviousCellValues = true;
                    }
                    if (advancedOptions.includePreviousFieldDefinitions === true) {
                        includes.includePreviousFieldDefinitions = true;
                    }
                    const specification = { options: { filters } };
                    if (Object.keys(includes).length > 0) {
                        specification.options.includes = includes;
                    }
                    const body = { specification };
                    if (webhookUrl) {
                        body.notificationUrl = webhookUrl;
                    }
                    try {
                        const endpoint = `/bases/${baseId}/webhooks`;
                        const response = await GenericFunctions_1.airtableApiRequest.call(this, 'POST', endpoint, body);
                        webhookData.webhookId = response.id;
                        webhookData.macSecretBase64 = response.macSecretBase64;
                        webhookData.baseId = baseId;
                        return true;
                    }
                    catch (error) {
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
                        const endpoint = `/bases/${baseId}/webhooks/${webhookData.webhookId}`;
                        await GenericFunctions_1.airtableApiRequest.call(this, 'DELETE', endpoint);
                        delete webhookData.webhookId;
                        delete webhookData.macSecretBase64;
                        delete webhookData.baseId;
                        return true;
                    }
                    catch (error) {
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
        // Verify HMAC signature
        if (webhookData.macSecretBase64 && headerData['x-airtable-signature']) {
            const signature = headerData['x-airtable-signature'];
            const { createHmac } = await Promise.resolve().then(() => __importStar(require('crypto')));
            const computedSignature = createHmac('sha256', Buffer.from(webhookData.macSecretBase64, 'base64'))
                .update(req.rawBody)
                .digest('base64');
            if (signature !== computedSignature) {
                return {};
            }
        }
        // Parse payload into flat per-record/per-event items
        try {
            const items = [];
            const source = body.actionMetadata && body.actionMetadata.source;
            const changedBy = body.actionMetadata && body.actionMetadata.sourceMetadata
                ? body.actionMetadata.sourceMetadata.user || body.actionMetadata.sourceMetadata
                : undefined;
            const timestamp = body.timestamp;
            const baseTransactionNumber = body.baseTransactionNumber;
            if (body.changedTablesById) {
                for (const tableId of Object.keys(body.changedTablesById)) {
                    const tableData = body.changedTablesById[tableId];
                    // Created records
                    if (tableData.createdRecordsById) {
                        for (const recordId of Object.keys(tableData.createdRecordsById)) {
                            const record = tableData.createdRecordsById[recordId];
                            items.push({
                                eventType: 'add',
                                recordId,
                                tableId,
                                createdTime: record.createdTime,
                                fields: record.cellValuesByFieldId || {},
                                source,
                                changedBy,
                                timestamp,
                                baseTransactionNumber,
                            });
                        }
                    }
                    // Updated records
                    if (tableData.changedRecordsById) {
                        for (const recordId of Object.keys(tableData.changedRecordsById)) {
                            const recordData = tableData.changedRecordsById[recordId];
                            items.push({
                                eventType: 'update',
                                recordId,
                                tableId,
                                current: recordData.current ? recordData.current.cellValuesByFieldId || {} : {},
                                previous: recordData.previous ? recordData.previous.cellValuesByFieldId || {} : undefined,
                                unchanged: recordData.unchanged ? recordData.unchanged.cellValuesByFieldId || {} : undefined,
                                source,
                                changedBy,
                                timestamp,
                                baseTransactionNumber,
                            });
                        }
                    }
                    // Deleted records
                    if (tableData.destroyedRecordIds) {
                        for (const recordId of tableData.destroyedRecordIds) {
                            items.push({
                                eventType: 'remove',
                                recordId,
                                tableId,
                                source,
                                changedBy,
                                timestamp,
                                baseTransactionNumber,
                            });
                        }
                    }
                    // View-scoped changes (when recordChangeScope is a view)
                    if (tableData.changedViewsById) {
                        for (const viewId of Object.keys(tableData.changedViewsById)) {
                            const viewData = tableData.changedViewsById[viewId];
                            if (viewData.createdRecordsById) {
                                for (const recordId of Object.keys(viewData.createdRecordsById)) {
                                    const record = viewData.createdRecordsById[recordId];
                                    items.push({
                                        eventType: 'add',
                                        recordId,
                                        tableId,
                                        viewId,
                                        createdTime: record.createdTime,
                                        fields: record.cellValuesByFieldId || {},
                                        source,
                                        changedBy,
                                        timestamp,
                                        baseTransactionNumber,
                                    });
                                }
                            }
                            if (viewData.changedRecordsById) {
                                for (const recordId of Object.keys(viewData.changedRecordsById)) {
                                    const recordData = viewData.changedRecordsById[recordId];
                                    items.push({
                                        eventType: 'update',
                                        recordId,
                                        tableId,
                                        viewId,
                                        current: recordData.current ? recordData.current.cellValuesByFieldId || {} : {},
                                        previous: recordData.previous ? recordData.previous.cellValuesByFieldId || {} : undefined,
                                        unchanged: recordData.unchanged ? recordData.unchanged.cellValuesByFieldId || {} : undefined,
                                        source,
                                        changedBy,
                                        timestamp,
                                        baseTransactionNumber,
                                    });
                                }
                            }
                            if (viewData.destroyedRecordIds) {
                                for (const recordId of viewData.destroyedRecordIds) {
                                    items.push({
                                        eventType: 'remove',
                                        recordId,
                                        tableId,
                                        viewId,
                                        source,
                                        changedBy,
                                        timestamp,
                                        baseTransactionNumber,
                                    });
                                }
                            }
                        }
                    }
                }
            }
            // Created tables
            if (body.createdTablesById) {
                for (const tableId of Object.keys(body.createdTablesById)) {
                    items.push({
                        eventType: 'add',
                        objectType: 'table',
                        tableId,
                        metadata: body.createdTablesById[tableId].metadata,
                        source,
                        changedBy,
                        timestamp,
                        baseTransactionNumber,
                    });
                }
            }
            // Destroyed tables
            if (body.destroyedTableIds) {
                for (const tableId of body.destroyedTableIds) {
                    items.push({
                        eventType: 'remove',
                        objectType: 'table',
                        tableId,
                        source,
                        changedBy,
                        timestamp,
                        baseTransactionNumber,
                    });
                }
            }
            // Error payloads
            if (body.error) {
                items.push({
                    eventType: 'error',
                    code: body.code,
                    timestamp,
                    baseTransactionNumber,
                });
            }
            if (items.length === 0) {
                // Unknown payload shape — pass raw body
                return {
                    workflowData: [this.helpers.returnJsonArray(body)],
                };
            }
            return {
                workflowData: [this.helpers.returnJsonArray(items)],
            };
        }
        catch (error) {
            // Parse failure — pass raw body
            return {
                workflowData: [this.helpers.returnJsonArray(body)],
            };
        }
    }
}
exports.AirtableWebhookTrigger = AirtableWebhookTrigger;
//# sourceMappingURL=AirtableWebhookTrigger.node.js.map
