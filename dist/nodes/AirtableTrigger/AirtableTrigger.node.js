"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirtableTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class AirtableTrigger {
    constructor() {
        this.description = {
            displayName: 'Airtable Webhook',
            name: 'airtableTrigger',
            icon: 'file:airtable.svg',
            group: ['trigger'],
            version: 1,
            description: 'Triggers instantly when Airtable records change. Uses real Airtable webhooks — no polling. The webhook is registered automatically when you activate the workflow, and deleted when you deactivate it. Webhooks expire every 7 days — use the Airtable Webhooks Refresh workflow to keep them alive.',
            defaults: {
                name: 'Airtable Webhook',
            },
            inputs: [],
            outputs: [{ type: "main" }],
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
                    displayName: 'Base',
                    name: 'base',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getBases',
                    },
                    required: true,
                    default: '',
                    description: 'The Airtable base to watch. All bases accessible by your API token are listed.',
                },
                {
                    displayName: 'Table',
                    name: 'table',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getTables',
                        loadOptionsDependsOn: ['base'],
                    },
                    required: true,
                    default: '',
                    description: 'The table to watch for changes.',
                },
                {
                    displayName: 'View (Optional)',
                    name: 'view',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getViews',
                        loadOptionsDependsOn: ['base', 'table'],
                    },
                    default: '',
                    description: 'Scope the webhook to a specific view. Only changes to records that are visible in this view will trigger the workflow. Use this to filter by user, status, or any view filter. Leave empty to watch all records in the table.',
                },
                {
                    displayName: 'Fields to Watch',
                    name: 'fieldsToWatch',
                    type: 'multiOptions',
                    typeOptions: {
                        loadOptionsMethod: 'getFields',
                        loadOptionsDependsOn: ['base', 'table'],
                    },
                    default: [],
                    description: 'Only trigger when these specific fields change. If empty, any field change triggers the workflow. Tip: use a "Refresh" checkbox field to trigger on demand.',
                },
                {
                    displayName: 'Extra Fields in Output',
                    name: 'fieldsToInclude',
                    type: 'multiOptions',
                    typeOptions: {
                        loadOptionsMethod: 'getFields',
                        loadOptionsDependsOn: ['base', 'table'],
                    },
                    default: [],
                    description: 'Include these field values in the output alongside the changed field. Useful for getting record context (e.g. Title, Status) without a separate API call.',
                },
                {
                    displayName: 'Include Previous Values',
                    name: 'includePreviousValues',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to include the previous value of changed fields. Useful for detecting what changed (e.g. status went from "Active" to "Done").',
                },
                {
                    displayName: 'Event Types',
                    name: 'eventTypes',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Record Created',
                            value: 'add',
                            description: 'A new record was added to the table (or entered the view)',
                        },
                        {
                            name: 'Record Updated',
                            value: 'update',
                            description: 'A field value changed on an existing record',
                        },
                        {
                            name: 'Record Deleted',
                            value: 'remove',
                            description: 'A record was deleted (or left the view)',
                        },
                    ],
                    required: true,
                    default: ['update'],
                    description: 'Which record events should trigger this workflow. Most use cases only need "Record Updated".',
                },
                {
                    displayName: 'Advanced Options',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Option',
                    default: {},
                    description: 'Fine-tune what triggers the webhook. Most users don\'t need these.',
                    options: [
                        {
                            displayName: 'Change Types to Watch',
                            name: 'dataTypes',
                            type: 'multiOptions',
                            options: [
                                {
                                    name: 'Record Data',
                                    value: 'tableData',
                                    description: 'Cell value changes — the most common use case',
                                },
                                {
                                    name: 'Field Schema',
                                    value: 'tableFields',
                                    description: 'Field added, renamed, deleted, or type changed',
                                },
                                {
                                    name: 'Table Metadata',
                                    value: 'tableMetadata',
                                    description: 'Table name or description changed',
                                },
                            ],
                            default: ['tableData'],
                            description: 'What kind of changes to listen for. Default: record data only.',
                        },
                        {
                            displayName: 'Filter by Change Source',
                            name: 'fromSources',
                            type: 'multiOptions',
                            options: [
                                {
                                    name: 'User (Web/Mobile)',
                                    value: 'client',
                                    description: 'Changes made by a user in the Airtable UI',
                                },
                                {
                                    name: 'API',
                                    value: 'publicApi',
                                    description: 'Changes made via the Airtable REST API',
                                },
                                {
                                    name: 'Automation',
                                    value: 'automation',
                                    description: 'Changes made by an Airtable automation',
                                },
                                {
                                    name: 'Form View',
                                    value: 'formSubmission',
                                    description: 'Submitted via a form view',
                                },
                                {
                                    name: 'Interface Form',
                                    value: 'formPageSubmission',
                                    description: 'Submitted via an interface form page',
                                },
                                {
                                    name: 'Sync',
                                    value: 'sync',
                                    description: 'Changes from Airtable Sync',
                                },
                                {
                                    name: 'System',
                                    value: 'system',
                                    description: 'Internal Airtable system events',
                                },
                                {
                                    name: 'Anonymous',
                                    value: 'anonymousUser',
                                    description: 'Changes by unauthenticated users (e.g. public forms)',
                                },
                                {
                                    name: 'Unknown',
                                    value: 'unknown',
                                },
                            ],
                            default: [],
                            description: 'Only trigger for changes from these sources. Leave empty to trigger on all sources (recommended).',
                        },
                        {
                            displayName: 'Source Options (JSON)',
                            name: 'sourceOptions',
                            type: 'string',
                            default: '',
                            placeholder: '{"formSubmission":{"viewId":"viw..."}}',
                            description: 'Advanced: filter form submissions by view ID or interface form submissions by page ID. JSON format. Most users don\'t need this.',
                        },
                        {
                            displayName: 'Watch Field Schema Changes',
                            name: 'watchSchemasOfFieldIds',
                            type: 'multiOptions',
                            typeOptions: {
                                loadOptionsMethod: 'getFields',
                                loadOptionsDependsOn: ['base', 'table'],
                            },
                            default: [],
                            description: 'Trigger when the schema of these fields changes (e.g. field renamed, type changed, options modified). Requires "Field Schema" in Change Types above.',
                        },
                    ],
                },
            ],
        };
        this.methods = {
            loadOptions: {
                async getBases() {
                    try {
                        const bases = await GenericFunctions_1.getBases.call(this);
                        return bases.map(base => ({
                            name: base.name,
                            value: base.id,
                        }));
                    }
                    catch (error) {
                        return [];
                    }
                },
                async getTables() {
                    const baseId = this.getNodeParameter('base', '');
                    if (!baseId) {
                        return [];
                    }
                    try {
                        const endpoint = `/meta/bases/${baseId}/tables`;
                        const response = await GenericFunctions_1.airtableApiRequest.call(this, 'GET', endpoint);
                        if (!response.tables || !Array.isArray(response.tables)) {
                            return [];
                        }
                        return response.tables.map((table) => ({
                            name: table.name,
                            value: table.id,
                            description: `${table.fields ? table.fields.length : 0} fields available`,
                        }));
                    }
                    catch (error) {
                        return [];
                    }
                },
                async getViews() {
                    const baseId = this.getNodeParameter('base', '');
                    const tableId = this.getNodeParameter('table', '');
                    if (!baseId || !tableId) {
                        return [];
                    }
                    try {
                        const views = await GenericFunctions_1.getViews.call(this, baseId, tableId);
                        if (!views || views.length === 0) {
                            return [];
                        }
                        return views.map(view => ({
                            name: view.name,
                            value: view.id,
                            description: `Type: ${view.type}`,
                        }));
                    }
                    catch (error) {
                        return [];
                    }
                },
                async getFields() {
                    const baseId = this.getNodeParameter('base', '');
                    const tableId = this.getNodeParameter('table', '');
                    if (!baseId || !tableId) {
                        return [];
                    }
                    try {
                        const fields = await GenericFunctions_1.getFields.call(this, baseId, tableId);
                        if (!fields || fields.length === 0) {
                            return [];
                        }
                        return fields.map(field => ({
                            name: field.name,
                            value: field.id,
                            description: `Type: ${field.type}`,
                        }));
                    }
                    catch (error) {
                        return [];
                    }
                },
            },
        };
        this.webhookMethods = {
            default: {
                async checkExists() {
                    const webhookData = this.getWorkflowStaticData('node');
                    if (webhookData.webhookId === undefined) {
                        return false;
                    }
                    try {
                        const baseId = webhookData.baseId;
                        const endpoint = `/bases/${baseId}/webhooks`;
                        const { webhooks } = await GenericFunctions_1.airtableApiRequest.call(this, 'GET', endpoint);
                        for (const webhook of webhooks) {
                            if (webhook.id === webhookData.webhookId) {
                                return true;
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
                    const baseId = this.getNodeParameter('base');
                    const tableId = this.getNodeParameter('table');
                    const viewId = this.getNodeParameter('view', '');
                    const fieldsToWatch = this.getNodeParameter('fieldsToWatch', []);
                    const includePreviousValues = this.getNodeParameter('includePreviousValues');
                    const eventTypes = this.getNodeParameter('eventTypes', []);
                    try {
                        const endpoint = `/bases/${baseId}/webhooks`;
                        const additionalFields = this.getNodeParameter('additionalFields', {});
                        const body = {
                            notificationUrl: webhookUrl,
                            specification: {
                                options: {
                                    filters: {
                                        dataTypes: ['tableData'],
                                        recordChangeScope: viewId || tableId,
                                        changeTypes: eventTypes,
                                    },
                                    includes: {
                                        includePreviousCellValues: includePreviousValues
                                    }
                                }
                            }
                        };
                        if (fieldsToWatch && fieldsToWatch.length > 0) {
                            body.specification.options.filters.watchDataInFieldIds = fieldsToWatch;
                        }
                        const fieldsToInclude = this.getNodeParameter('fieldsToInclude', []);
                        if (fieldsToInclude && fieldsToInclude.length > 0) {
                            body.specification.options.includes.includeCellValuesInFieldIds = fieldsToInclude;
                        }
                        if (additionalFields.dataTypes && Array.isArray(additionalFields.dataTypes) && additionalFields.dataTypes.length > 0) {
                            body.specification.options.filters.dataTypes = additionalFields.dataTypes;
                        }
                        if (additionalFields.fromSources && Array.isArray(additionalFields.fromSources) && additionalFields.fromSources.length > 0) {
                            body.specification.options.filters.fromSources = additionalFields.fromSources;
                        }
                        if (additionalFields.sourceOptions) {
                            try {
                                const sourceOptions = JSON.parse(additionalFields.sourceOptions);
                                body.specification.options.filters.sourceOptions = sourceOptions;
                            }
                            catch (error) {
                            }
                        }
                        if (additionalFields.watchSchemasOfFieldIds && Array.isArray(additionalFields.watchSchemasOfFieldIds) && additionalFields.watchSchemasOfFieldIds.length > 0) {
                            body.specification.options.filters.watchSchemasOfFieldIds = additionalFields.watchSchemasOfFieldIds;
                        }
                        const response = await GenericFunctions_1.airtableApiRequest.call(this, 'POST', endpoint, body);
                        webhookData.webhookId = response.id;
                        webhookData.baseId = baseId;
                        webhookData.tableId = tableId;
                        webhookData.macSecretBase64 = response.macSecretBase64;
                        webhookData.lastCursor = 1;
                        webhookData.fieldsToInclude = this.getNodeParameter('fieldsToInclude', []);
                        webhookData.additionalFields = additionalFields;
                        webhookData.eventTypes = eventTypes;
                        return true;
                    }
                    catch (error) {
                        throw error;
                    }
                },
                async delete() {
                    const webhookData = this.getWorkflowStaticData('node');
                    if (webhookData.webhookId === undefined || webhookData.baseId === undefined) {
                        return false;
                    }
                    try {
                        const endpoint = `/bases/${webhookData.baseId}/webhooks/${webhookData.webhookId}`;
                        await GenericFunctions_1.airtableApiRequest.call(this, 'DELETE', endpoint);
                        delete webhookData.webhookId;
                        delete webhookData.baseId;
                        delete webhookData.tableId;
                        delete webhookData.macSecretBase64;
                        delete webhookData.lastCursor;
                        delete webhookData.fieldsToInclude;
                        delete webhookData.additionalFields;
                        delete webhookData.eventTypes;
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
        var _a, _b, _c, _d, _e, _f;
        const req = this.getRequestObject();
        const webhookData = this.getWorkflowStaticData('node');
        if (!req.body || !req.body.base || !req.body.webhook) {
            return {};
        }
        try {
            const baseId = req.body.base.id;
            const webhookId = req.body.webhook.id;
            const webhookEndpoint = `/bases/${baseId}/webhooks`;
            const webhooksResponse = await GenericFunctions_1.airtableApiRequest.call(this, 'GET', webhookEndpoint);
            let cursorForNextPayload = 1;
            if (webhooksResponse && webhooksResponse.webhooks) {
                for (const webhook of webhooksResponse.webhooks) {
                    if (webhook.id === webhookId) {
                        cursorForNextPayload = webhook.cursorForNextPayload || 1;
                        break;
                    }
                }
            }
            webhookData.lastCursor = cursorForNextPayload;
            const payloadEndpoint = `/bases/${baseId}/webhooks/${webhookId}/payloads`;
            const queryParams = { cursor: cursorForNextPayload - 1 };
            const payloadsResponse = await GenericFunctions_1.airtableApiRequest.call(this, 'GET', payloadEndpoint, {}, queryParams);
            if (!payloadsResponse.payloads || payloadsResponse.payloads.length === 0) {
                return {};
            }
            const formattedPayloads = [];
            const fieldsToInclude = webhookData.fieldsToInclude || [];
            for (const payload of payloadsResponse.payloads) {
                if (!payload.changedTablesById) {
                    continue;
                }
                for (const tableId in payload.changedTablesById) {
                    if (!webhookData.tableId || tableId === webhookData.tableId) {
                        const tableData = payload.changedTablesById[tableId];
                        if (tableData.changedRecordsById) {
                            const changedRecords = tableData.changedRecordsById;
                            const fieldInfos = (0, GenericFunctions_1.extractFieldInfo)(changedRecords, fieldsToInclude);
                            for (const fieldInfo of fieldInfos) {
                                formattedPayloads.push({
                                    ...fieldInfo,
                                    tableId,
                                    changedBy: ((_b = (_a = payload.actionMetadata) === null || _a === void 0 ? void 0 : _a.sourceMetadata) === null || _b === void 0 ? void 0 : _b.user) ? {
                                        userId: payload.actionMetadata.sourceMetadata.user.id,
                                        userName: payload.actionMetadata.sourceMetadata.user.name,
                                        userEmail: payload.actionMetadata.sourceMetadata.user.email,
                                    } : undefined,
                                    timestamp: payload.timestamp,
                                });
                            }
                        }
                        if (tableData.changedFieldsById) {
                            const fieldSchemaInfos = (0, GenericFunctions_1.extractFieldSchemaInfo)(tableData.changedFieldsById);
                            for (const fieldSchemaInfo of fieldSchemaInfos) {
                                formattedPayloads.push({
                                    ...fieldSchemaInfo,
                                    tableId,
                                    changedBy: ((_d = (_c = payload.actionMetadata) === null || _c === void 0 ? void 0 : _c.sourceMetadata) === null || _d === void 0 ? void 0 : _d.user) ? {
                                        userId: payload.actionMetadata.sourceMetadata.user.id,
                                        userName: payload.actionMetadata.sourceMetadata.user.name,
                                        userEmail: payload.actionMetadata.sourceMetadata.user.email,
                                    } : undefined,
                                    timestamp: payload.timestamp,
                                });
                            }
                        }
                        if (tableData.changedMetadata) {
                            const tableMetadataInfos = (0, GenericFunctions_1.extractTableMetadataInfo)(tableData.changedMetadata);
                            for (const tableMetadataInfo of tableMetadataInfos) {
                                formattedPayloads.push({
                                    ...tableMetadataInfo,
                                    tableId,
                                    changedBy: ((_f = (_e = payload.actionMetadata) === null || _e === void 0 ? void 0 : _e.sourceMetadata) === null || _f === void 0 ? void 0 : _f.user) ? {
                                        userId: payload.actionMetadata.sourceMetadata.user.id,
                                        userName: payload.actionMetadata.sourceMetadata.user.name,
                                        userEmail: payload.actionMetadata.sourceMetadata.user.email,
                                    } : undefined,
                                    timestamp: payload.timestamp,
                                });
                            }
                        }
                    }
                }
            }
            return {
                workflowData: [
                    this.helpers.returnJsonArray(formattedPayloads),
                ],
            };
        }
        catch (error) {
            return {
                workflowData: [
                    this.helpers.returnJsonArray([req.body]),
                ],
            };
        }
    }
}
exports.AirtableTrigger = AirtableTrigger;
//# sourceMappingURL=AirtableTrigger.node.js.map