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
                // ── Always visible ──────────────────────────────────────────
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
                            description: 'Field schema changes (name, type)',
                        },
                        {
                            name: 'Table Metadata',
                            value: 'tableMetadata',
                            description: 'Table name and description changes',
                        },
                    ],
                    default: ['tableData'],
                    required: true,
                    description: 'Which types of changes to watch',
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
                            description: 'Object was deleted (or left a view)',
                        },
                        {
                            name: 'Update',
                            value: 'update',
                            description: 'Object was modified',
                        },
                    ],
                    default: [],
                    description: 'Only trigger for these change types. Leave empty for all.',
                },
                {
                    displayName: 'Record Change Scope',
                    name: 'recordChangeScope',
                    type: 'string',
                    default: '',
                    description: 'Only watch changes in this table or view (TableId or ViewId). Leave empty for entire base. Form view and List view are not supported.',
                },
                // ── Table Data options (shown when tableData selected) ──────
                {
                    displayName: 'Watch Fields',
                    name: 'watchDataInFieldIds',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            dataTypes: ['tableData'],
                        },
                    },
                    description: 'Only trigger when these fields change. Comma-separated field IDs (e.g. fldABC,fldDEF). Leave empty for all fields. Warning: webhook stops if a listed field is deleted.',
                },
                {
                    displayName: 'Include Cell Values',
                    name: 'includeCellValues',
                    type: 'options',
                    options: [
                        {
                            name: 'Only Changed Fields',
                            value: 'none',
                            description: 'Default — payload only contains fields that changed',
                        },
                        {
                            name: 'All Fields',
                            value: 'all',
                            description: 'Always include every field value, even if unchanged',
                        },
                        {
                            name: 'Specific Fields',
                            value: 'specific',
                            description: 'Always include specific fields, even if unchanged',
                        },
                    ],
                    default: 'none',
                    displayOptions: {
                        show: {
                            dataTypes: ['tableData'],
                        },
                    },
                    description: 'Which field values to include in every payload, regardless of whether they changed',
                },
                {
                    displayName: 'Field IDs to Always Include',
                    name: 'includeCellValuesFieldIds',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            dataTypes: ['tableData'],
                            includeCellValues: ['specific'],
                        },
                    },
                    description: 'Comma-separated field IDs to always include (e.g. fldABC,fldDEF). Safe if a listed field is deleted — it is silently ignored.',
                },
                {
                    displayName: 'Include Previous Cell Values',
                    name: 'includePreviousCellValues',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            dataTypes: ['tableData'],
                        },
                    },
                    description: 'Whether to include the previous value of changed fields (useful for detecting what changed)',
                },
                // ── Table Fields options (shown when tableFields selected) ──
                {
                    displayName: 'Watch Field Schemas',
                    name: 'watchSchemasOfFieldIds',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            dataTypes: ['tableFields'],
                        },
                    },
                    description: 'Only trigger when these field schemas change. Comma-separated field IDs. Leave empty for all. Warning: webhook stops if a listed field is deleted.',
                },
                {
                    displayName: 'Include Previous Field Definitions',
                    name: 'includePreviousFieldDefinitions',
                    type: 'boolean',
                    default: false,
                    displayOptions: {
                        show: {
                            dataTypes: ['tableFields'],
                        },
                    },
                    description: 'Whether to include the previous field name/type alongside the current in field change payloads',
                },
                // ── Source Filtering ────────────────────────────────────────
                {
                    displayName: 'From Sources',
                    name: 'fromSources',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Client',
                            value: 'client',
                            description: 'User action via web or mobile',
                        },
                        {
                            name: 'Public API',
                            value: 'publicApi',
                            description: 'Airtable REST API',
                        },
                        {
                            name: 'Form Submission',
                            value: 'formSubmission',
                            description: 'Form view submission',
                        },
                        {
                            name: 'Form Page Submission',
                            value: 'formPageSubmission',
                            description: 'Interface form builder / record creation page',
                        },
                        {
                            name: 'Automation',
                            value: 'automation',
                            description: 'Airtable automation action',
                        },
                        {
                            name: 'System',
                            value: 'system',
                            description: 'System events (e.g. formula recalculation)',
                        },
                        {
                            name: 'Sync',
                            value: 'sync',
                            description: 'Airtable Sync',
                        },
                        {
                            name: 'Anonymous User',
                            value: 'anonymousUser',
                        },
                        {
                            name: 'Unknown',
                            value: 'unknown',
                        },
                    ],
                    default: [],
                    description: 'Only trigger for changes from these sources. Leave empty for all.',
                },
                {
                    displayName: 'Form Submission View ID',
                    name: 'formSubmissionViewId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            fromSources: ['formSubmission'],
                        },
                    },
                    description: 'Only trigger for submissions from this specific form view (ViewId)',
                },
                {
                    displayName: 'Form Page Submission Page ID',
                    name: 'formPageSubmissionPageId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            fromSources: ['formPageSubmission'],
                        },
                    },
                    description: 'Only trigger for submissions from this specific interface page (PageId)',
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
                    const fromSources = this.getNodeParameter('fromSources', []);
                    // Build filters
                    const filters = { dataTypes };
                    if (changeTypes.length > 0) {
                        filters.changeTypes = changeTypes;
                    }
                    if (recordChangeScope) {
                        filters.recordChangeScope = recordChangeScope;
                    }
                    if (fromSources.length > 0) {
                        filters.fromSources = fromSources;
                    }
                    // sourceOptions (conditional on fromSources)
                    const sourceOptions = {};
                    if (fromSources.includes('formSubmission')) {
                        const viewId = this.getNodeParameter('formSubmissionViewId', '');
                        if (viewId) {
                            sourceOptions.formSubmission = { viewId };
                        }
                    }
                    if (fromSources.includes('formPageSubmission')) {
                        const pageId = this.getNodeParameter('formPageSubmissionPageId', '');
                        if (pageId) {
                            sourceOptions.formPageSubmission = { pageId };
                        }
                    }
                    if (Object.keys(sourceOptions).length > 0) {
                        filters.sourceOptions = sourceOptions;
                    }
                    // tableData-specific filters
                    if (dataTypes.includes('tableData')) {
                        const watchDataInFieldIds = this.getNodeParameter('watchDataInFieldIds', '');
                        if (watchDataInFieldIds) {
                            const fieldIds = watchDataInFieldIds.split(',').map(id => id.trim()).filter(Boolean);
                            if (fieldIds.length > 0) {
                                filters.watchDataInFieldIds = fieldIds;
                            }
                        }
                    }
                    // tableFields-specific filters
                    if (dataTypes.includes('tableFields')) {
                        const watchSchemasOfFieldIds = this.getNodeParameter('watchSchemasOfFieldIds', '');
                        if (watchSchemasOfFieldIds) {
                            const fieldIds = watchSchemasOfFieldIds.split(',').map(id => id.trim()).filter(Boolean);
                            if (fieldIds.length > 0) {
                                filters.watchSchemasOfFieldIds = fieldIds;
                            }
                        }
                    }
                    // Build includes
                    const includes = {};
                    if (dataTypes.includes('tableData')) {
                        const includeCellValues = this.getNodeParameter('includeCellValues', 'none');
                        if (includeCellValues === 'all') {
                            includes.includeCellValuesInFieldIds = 'all';
                        } else if (includeCellValues === 'specific') {
                            const fieldIdsStr = this.getNodeParameter('includeCellValuesFieldIds', '');
                            if (fieldIdsStr) {
                                const fieldIds = fieldIdsStr.split(',').map(id => id.trim()).filter(Boolean);
                                if (fieldIds.length > 0) {
                                    includes.includeCellValuesInFieldIds = fieldIds;
                                }
                            }
                        }
                        const includePreviousCellValues = this.getNodeParameter('includePreviousCellValues', false);
                        if (includePreviousCellValues) {
                            includes.includePreviousCellValues = true;
                        }
                    }
                    if (dataTypes.includes('tableFields')) {
                        const includePreviousFieldDefinitions = this.getNodeParameter('includePreviousFieldDefinitions', false);
                        if (includePreviousFieldDefinitions) {
                            includes.includePreviousFieldDefinitions = true;
                        }
                    }
                    // Build specification
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
        // Parse payload into flat per-event items
        try {
            const items = [];
            const source = body.actionMetadata && body.actionMetadata.source;
            const sourceMetadata = body.actionMetadata && body.actionMetadata.sourceMetadata;
            const timestamp = body.timestamp;
            const baseTransactionNumber = body.baseTransactionNumber;
            // Process changed tables
            if (body.changedTablesById) {
                for (const tableId of Object.keys(body.changedTablesById)) {
                    const tableData = body.changedTablesById[tableId];
                    // ── tableData: records ──────────────────────────────────
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
                                sourceMetadata,
                                timestamp,
                                baseTransactionNumber,
                            });
                        }
                    }
                    // Updated records
                    if (tableData.changedRecordsById) {
                        for (const recordId of Object.keys(tableData.changedRecordsById)) {
                            const recordData = tableData.changedRecordsById[recordId];
                            const item = {
                                eventType: 'update',
                                recordId,
                                tableId,
                                current: recordData.current ? recordData.current.cellValuesByFieldId || {} : {},
                                source,
                                sourceMetadata,
                                timestamp,
                                baseTransactionNumber,
                            };
                            if (recordData.previous) {
                                item.previous = recordData.previous.cellValuesByFieldId || {};
                            }
                            if (recordData.unchanged) {
                                item.unchanged = recordData.unchanged.cellValuesByFieldId || {};
                            }
                            items.push(item);
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
                                sourceMetadata,
                                timestamp,
                                baseTransactionNumber,
                            });
                        }
                    }
                    // ── View-scoped record changes ──────────────────────────
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
                                        sourceMetadata,
                                        timestamp,
                                        baseTransactionNumber,
                                    });
                                }
                            }
                            if (viewData.changedRecordsById) {
                                for (const recordId of Object.keys(viewData.changedRecordsById)) {
                                    const recordData = viewData.changedRecordsById[recordId];
                                    const item = {
                                        eventType: 'update',
                                        recordId,
                                        tableId,
                                        viewId,
                                        current: recordData.current ? recordData.current.cellValuesByFieldId || {} : {},
                                        source,
                                        sourceMetadata,
                                        timestamp,
                                        baseTransactionNumber,
                                    };
                                    if (recordData.previous) {
                                        item.previous = recordData.previous.cellValuesByFieldId || {};
                                    }
                                    if (recordData.unchanged) {
                                        item.unchanged = recordData.unchanged.cellValuesByFieldId || {};
                                    }
                                    items.push(item);
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
                                        sourceMetadata,
                                        timestamp,
                                        baseTransactionNumber,
                                    });
                                }
                            }
                        }
                    }
                    // ── tableFields: field schema changes ───────────────────
                    if (tableData.createdFieldsById) {
                        for (const fieldId of Object.keys(tableData.createdFieldsById)) {
                            const field = tableData.createdFieldsById[fieldId];
                            items.push({
                                eventType: 'add',
                                objectType: 'field',
                                fieldId,
                                tableId,
                                name: field.name,
                                type: field.type,
                                source,
                                sourceMetadata,
                                timestamp,
                                baseTransactionNumber,
                            });
                        }
                    }
                    if (tableData.changedFieldsById) {
                        for (const fieldId of Object.keys(tableData.changedFieldsById)) {
                            const fieldData = tableData.changedFieldsById[fieldId];
                            const item = {
                                eventType: 'update',
                                objectType: 'field',
                                fieldId,
                                tableId,
                                current: fieldData.current,
                                source,
                                sourceMetadata,
                                timestamp,
                                baseTransactionNumber,
                            };
                            if (fieldData.previous) {
                                item.previous = fieldData.previous;
                            }
                            items.push(item);
                        }
                    }
                    if (tableData.destroyedFieldIds) {
                        for (const fieldId of tableData.destroyedFieldIds) {
                            items.push({
                                eventType: 'remove',
                                objectType: 'field',
                                fieldId,
                                tableId,
                                source,
                                sourceMetadata,
                                timestamp,
                                baseTransactionNumber,
                            });
                        }
                    }
                    // ── tableMetadata: table name/description changes ───────
                    if (tableData.changedMetadata) {
                        const item = {
                            eventType: 'update',
                            objectType: 'tableMetadata',
                            tableId,
                            current: tableData.changedMetadata.current,
                            previous: tableData.changedMetadata.previous,
                            source,
                            sourceMetadata,
                            timestamp,
                            baseTransactionNumber,
                        };
                        items.push(item);
                    }
                }
            }
            // Process created tables
            if (body.createdTablesById) {
                for (const tableId of Object.keys(body.createdTablesById)) {
                    const table = body.createdTablesById[tableId];
                    items.push({
                        eventType: 'add',
                        objectType: 'table',
                        tableId,
                        metadata: table.metadata,
                        fieldsById: table.fieldsById,
                        recordsById: table.recordsById,
                        source,
                        sourceMetadata,
                        timestamp,
                        baseTransactionNumber,
                    });
                }
            }
            // Process destroyed tables
            if (body.destroyedTableIds) {
                for (const tableId of body.destroyedTableIds) {
                    items.push({
                        eventType: 'remove',
                        objectType: 'table',
                        tableId,
                        source,
                        sourceMetadata,
                        timestamp,
                        baseTransactionNumber,
                    });
                }
            }
            // Error payloads
            if (body.error) {
                items.push({
                    eventType: 'error',
                    error: true,
                    code: body.code,
                    timestamp,
                    baseTransactionNumber,
                });
            }
            if (items.length === 0) {
                return {
                    workflowData: [this.helpers.returnJsonArray(body)],
                };
            }
            return {
                workflowData: [this.helpers.returnJsonArray(items)],
            };
        }
        catch (error) {
            return {
                workflowData: [this.helpers.returnJsonArray(body)],
            };
        }
    }
}
exports.AirtableWebhookTrigger = AirtableWebhookTrigger;
//# sourceMappingURL=AirtableWebhookTrigger.node.js.map
