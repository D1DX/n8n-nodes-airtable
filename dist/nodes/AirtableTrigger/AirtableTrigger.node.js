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
                    displayName: 'View',
                    name: 'view',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getViews',
                        loadOptionsDependsOn: ['base', 'table'],
                    },
                    default: '',
                    description: 'Scope the webhook to a specific view. Only changes to records visible in this view will trigger the workflow. When scoped to a view, you also get notified when records enter or leave the view. Leave as "All records" to watch the entire table.',
                },
                {
                    displayName: 'Event Types',
                    name: 'eventTypes',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Record Created',
                            value: 'created',
                            description: 'A new record was added to the table (or entered the view)',
                        },
                        {
                            name: 'Record Updated',
                            value: 'updated',
                            description: 'A field value changed on an existing record',
                        },
                        {
                            name: 'Record Deleted',
                            value: 'deleted',
                            description: 'A record was deleted from the table (or left the view)',
                        },
                    ],
                    required: true,
                    default: ['created', 'updated', 'deleted'],
                    description: 'Which record events should trigger this workflow.',
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
                    description: 'Only trigger when these specific fields change. If empty, any field change triggers the workflow. Tip: use a "Refresh" checkbox field to trigger on demand. Only applies to "Record Updated" events.',
                },
                {
                    displayName: 'Fields to Include in Output',
                    name: 'fieldsToInclude',
                    type: 'multiOptions',
                    typeOptions: {
                        loadOptionsMethod: 'getFieldsWithAll',
                        loadOptionsDependsOn: ['base', 'table'],
                    },
                    default: [],
                    description: 'Include these field values in the output. Select "All fields" to include everything. Without this, you only get record IDs and changed field IDs — no actual values.',
                },
                {
                    displayName: 'Use Field Names',
                    name: 'useFieldNames',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to use human-readable field names (e.g. "Status", "Due Date") instead of field IDs (e.g. "fldABC123") in the output. Enable this for easier use in downstream nodes.',
                },
                {
                    displayName: 'Include Previous Values',
                    name: 'includePreviousValues',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to include the previous value of changed fields. Useful for detecting what changed (e.g. status went from "Active" to "Done"). Only applies to "Record Updated" events.',
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
                            displayName: 'Data Types',
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
                            ],
                            default: [],
                            description: 'Only trigger for changes from these sources. Leave empty to trigger on all sources. Tip: exclude "API" to prevent loops if your workflow writes back to Airtable.',
                        },
                        {
                            displayName: 'Form Submission View ID',
                            name: 'formSubmissionViewId',
                            type: 'string',
                            default: '',
                            description: 'Only trigger for submissions from this specific form view (ViewId). Only applies when "Form View" is selected in Filter by Change Source.',
                        },
                        {
                            displayName: 'Form Page Submission Page ID',
                            name: 'formPageSubmissionPageId',
                            type: 'string',
                            default: '',
                            description: 'Only trigger for submissions from this specific interface page (PageId). Only applies when "Interface Form" is selected in Filter by Change Source.',
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
                            description: 'Trigger when the schema of these fields changes (e.g. field renamed, type changed). Requires "Field Schema" in Data Types above.',
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
                            description: `${table.fields ? table.fields.length : 0} fields`,
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
                        return [{ name: '— All records (no view filter) —', value: '' }];
                    }
                    try {
                        const views = await GenericFunctions_1.getViews.call(this, baseId, tableId);
                        const options = [
                            { name: '— All records (no view filter) —', value: '' },
                        ];
                        if (views && views.length > 0) {
                            for (const view of views) {
                                options.push({
                                    name: view.name,
                                    value: view.id,
                                    description: `Type: ${view.type}`,
                                });
                            }
                        }
                        return options;
                    }
                    catch (error) {
                        return [{ name: '— All records (no view filter) —', value: '' }];
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
                async getFieldsWithAll() {
                    const baseId = this.getNodeParameter('base', '');
                    const tableId = this.getNodeParameter('table', '');
                    if (!baseId || !tableId) {
                        return [{ name: '— All fields —', value: '__all__' }];
                    }
                    try {
                        const fields = await GenericFunctions_1.getFields.call(this, baseId, tableId);
                        const options = [
                            { name: '— All fields —', value: '__all__' },
                        ];
                        if (fields && fields.length > 0) {
                            for (const field of fields) {
                                options.push({
                                    name: field.name,
                                    value: field.id,
                                    description: `Type: ${field.type}`,
                                });
                            }
                        }
                        return options;
                    }
                    catch (error) {
                        return [{ name: '— All fields —', value: '__all__' }];
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
                    const fieldsToInclude = this.getNodeParameter('fieldsToInclude', []);
                    const includePreviousValues = this.getNodeParameter('includePreviousValues');
                    const eventTypes = this.getNodeParameter('eventTypes', []);
                    try {
                        const endpoint = `/bases/${baseId}/webhooks`;
                        const additionalFields = this.getNodeParameter('additionalFields', {});
                        const filters = {
                            dataTypes: ['tableData'],
                            recordChangeScope: viewId || tableId,
                        };
                        // Only add watchDataInFieldIds if specific fields selected
                        if (fieldsToWatch && fieldsToWatch.length > 0) {
                            filters.watchDataInFieldIds = fieldsToWatch;
                        }
                        const includes = {
                            includePreviousCellValues: includePreviousValues,
                        };
                        // Handle fieldsToInclude — "__all__" means all fields
                        if (fieldsToInclude && fieldsToInclude.length > 0) {
                            if (fieldsToInclude.includes('__all__')) {
                                includes.includeCellValuesInFieldIds = 'all';
                            } else {
                                includes.includeCellValuesInFieldIds = fieldsToInclude;
                            }
                        }
                        const body = {
                            notificationUrl: webhookUrl,
                            specification: {
                                options: {
                                    filters,
                                    includes,
                                },
                            },
                        };
                        // Advanced options
                        if (additionalFields.dataTypes && Array.isArray(additionalFields.dataTypes) && additionalFields.dataTypes.length > 0) {
                            body.specification.options.filters.dataTypes = additionalFields.dataTypes;
                        }
                        if (additionalFields.fromSources && Array.isArray(additionalFields.fromSources) && additionalFields.fromSources.length > 0) {
                            body.specification.options.filters.fromSources = additionalFields.fromSources;
                        }
                        const sourceOptions = {};
                        if (additionalFields.formSubmissionViewId) {
                            sourceOptions.formSubmission = { viewId: additionalFields.formSubmissionViewId };
                        }
                        if (additionalFields.formPageSubmissionPageId) {
                            sourceOptions.formPageSubmission = { pageId: additionalFields.formPageSubmissionPageId };
                        }
                        if (Object.keys(sourceOptions).length > 0) {
                            body.specification.options.filters.sourceOptions = sourceOptions;
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
                        webhookData.fieldsToInclude = fieldsToInclude;
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
        var _a, _b;
        const req = this.getRequestObject();
        const webhookData = this.getWorkflowStaticData('node');
        if (!req.body || !req.body.base || !req.body.webhook) {
            return {};
        }
        try {
            const baseId = req.body.base.id;
            const webhookId = req.body.webhook.id;
            const useFieldNames = this.getNodeParameter('useFieldNames', true);
            const eventTypes = webhookData.eventTypes || ['created', 'updated', 'deleted'];

            // Build field ID → name map if needed
            let fieldIdToName = {};
            if (useFieldNames) {
                try {
                    const fields = await GenericFunctions_1.getFields.call(this, baseId, webhookData.tableId);
                    for (const field of fields) {
                        fieldIdToName[field.id] = field.name;
                    }
                } catch (e) {
                    // Fall back to field IDs if schema fetch fails
                }
            }

            // Fetch payloads using cursor
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

            const resolveKey = (fieldId) => {
                if (useFieldNames && fieldIdToName[fieldId]) {
                    return fieldIdToName[fieldId];
                }
                return fieldId;
            };

            const resolveCellValues = (cellValuesByFieldId) => {
                if (!cellValuesByFieldId) return {};
                const resolved = {};
                for (const [fieldId, value] of Object.entries(cellValuesByFieldId)) {
                    resolved[resolveKey(fieldId)] = value;
                }
                return resolved;
            };

            const extractChangedBy = (payload) => {
                const meta = (_b = (_a = payload.actionMetadata) === null || _a === void 0 ? void 0 : _a.sourceMetadata) === null || _b === void 0 ? void 0 : _b.user;
                if (!meta) return undefined;
                return {
                    userId: meta.id,
                    userName: meta.name,
                    userEmail: meta.email,
                };
            };

            const formattedPayloads = [];
            for (const payload of payloadsResponse.payloads) {
                const source = payload.actionMetadata ? payload.actionMetadata.source : undefined;
                const changedBy = extractChangedBy(payload);

                // Process changedTablesById (updates, schema changes, metadata changes)
                if (payload.changedTablesById) {
                    for (const tableId in payload.changedTablesById) {
                        if (webhookData.tableId && tableId !== webhookData.tableId) continue;
                        const tableData = payload.changedTablesById[tableId];

                        // Record created
                        if (tableData.createdRecordsById && eventTypes.includes('created')) {
                            for (const recordId in tableData.createdRecordsById) {
                                const record = tableData.createdRecordsById[recordId];
                                formattedPayloads.push({
                                    eventType: 'created',
                                    recordId,
                                    tableId,
                                    createdTime: record.createdTime,
                                    fields: resolveCellValues(record.cellValuesByFieldId),
                                    source,
                                    changedBy,
                                    timestamp: payload.timestamp,
                                });
                            }
                        }

                        // Record updated
                        if (tableData.changedRecordsById && eventTypes.includes('updated')) {
                            for (const recordId in tableData.changedRecordsById) {
                                const recordData = tableData.changedRecordsById[recordId];
                                const currentFields = resolveCellValues(recordData.current ? recordData.current.cellValuesByFieldId : null);
                                const previousFields = resolveCellValues(recordData.previous ? recordData.previous.cellValuesByFieldId : null);
                                const unchangedFields = resolveCellValues(recordData.unchanged ? recordData.unchanged.cellValuesByFieldId : null);

                                // Build a list of which fields actually changed
                                const changedFields = Object.keys(currentFields);

                                formattedPayloads.push({
                                    eventType: 'updated',
                                    recordId,
                                    tableId,
                                    changedFields,
                                    current: currentFields,
                                    previous: previousFields,
                                    unchanged: unchangedFields,
                                    source,
                                    changedBy,
                                    timestamp: payload.timestamp,
                                });
                            }
                        }

                        // Record deleted
                        if (tableData.destroyedRecordIds && eventTypes.includes('deleted')) {
                            for (const recordId of tableData.destroyedRecordIds) {
                                formattedPayloads.push({
                                    eventType: 'deleted',
                                    recordId,
                                    tableId,
                                    source,
                                    changedBy,
                                    timestamp: payload.timestamp,
                                });
                            }
                        }

                        // Field schema changes
                        if (tableData.changedFieldsById) {
                            const fieldSchemaInfos = (0, GenericFunctions_1.extractFieldSchemaInfo)(tableData.changedFieldsById);
                            for (const info of fieldSchemaInfos) {
                                formattedPayloads.push({
                                    ...info,
                                    tableId,
                                    source,
                                    changedBy,
                                    timestamp: payload.timestamp,
                                });
                            }
                        }

                        // Table metadata changes
                        if (tableData.changedMetadata) {
                            const metadataInfos = (0, GenericFunctions_1.extractTableMetadataInfo)(tableData.changedMetadata);
                            for (const info of metadataInfos) {
                                formattedPayloads.push({
                                    ...info,
                                    tableId,
                                    source,
                                    changedBy,
                                    timestamp: payload.timestamp,
                                });
                            }
                        }
                    }
                }
            }
            if (formattedPayloads.length === 0) {
                return {};
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
