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
            description: 'Triggers when Airtable records change via webhooks. The webhook is registered automatically when you activate the workflow, and deleted when you deactivate it. Webhooks expire every 7 days — use the Airtable Webhooks Refresh workflow to keep them alive.',
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
                // ── Required ────────────────────────────────────────────
                {
                    displayName: 'Base',
                    name: 'base',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getBases',
                    },
                    required: true,
                    default: '',
                    description: 'The Airtable base to watch',
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
                    description: 'The table to watch for changes',
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
                    description: 'Scope to a specific view. When set, "add" means a record entered the view and "remove" means it left. Form views and List views are not supported. Maps to Airtable recordChangeScope.',
                },
                // ── Change Types ────────────────────────────────────────
                {
                    displayName: 'Change Types',
                    name: 'eventTypes',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Add',
                            value: 'created',
                            description: 'A record was created (or entered the view)',
                        },
                        {
                            name: 'Update',
                            value: 'updated',
                            description: 'A field value changed on an existing record',
                        },
                        {
                            name: 'Remove',
                            value: 'deleted',
                            description: 'A record was deleted (or left the view)',
                        },
                    ],
                    required: true,
                    default: ['created', 'updated', 'deleted'],
                    description: 'Which change types trigger this workflow. Maps to Airtable changeTypes filter (add/update/remove). Leave all selected to trigger on everything.',
                },
                // ── Fields to Watch (only for updates) ──────────────────
                {
                    displayName: 'Fields to Watch',
                    name: 'fieldsToWatch',
                    type: 'multiOptions',
                    typeOptions: {
                        loadOptionsMethod: 'getFields',
                        loadOptionsDependsOn: ['base', 'table'],
                    },
                    default: [],
                    displayOptions: {
                        show: {
                            eventTypes: ['updated'],
                        },
                    },
                    description: 'Only trigger when these specific fields change. Leave empty to watch all fields. Maps to Airtable watchDataInFieldIds. Warning: if a listed field is deleted, the webhook stops working.',
                },
                // ── Fields to Include in Output ─────────────────────────
                {
                    displayName: 'Fields to Include in Output',
                    name: 'fieldsToInclude',
                    type: 'multiOptions',
                    typeOptions: {
                        loadOptionsMethod: 'getFieldsWithAll',
                        loadOptionsDependsOn: ['base', 'table'],
                    },
                    default: [],
                    description: 'Always include these field values in the output, even if they did not change. Select "All fields" to include everything. Maps to Airtable includeCellValuesInFieldIds.',
                },
                // ── Output Options ──────────────────────────────────────
                {
                    displayName: 'Use Field Names',
                    name: 'useFieldNames',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to use human-readable field names (e.g. "Status") instead of field IDs (e.g. "fldABC123") in the output',
                },
                {
                    displayName: 'Include Previous Values',
                    name: 'includePreviousValues',
                    type: 'boolean',
                    default: true,
                    displayOptions: {
                        show: {
                            eventTypes: ['updated'],
                        },
                    },
                    description: 'Whether to include the previous value of changed fields. Maps to Airtable includePreviousCellValues.',
                },
                // ── Advanced Options ────────────────────────────────────
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
                                    name: 'Table Data',
                                    value: 'tableData',
                                    description: 'Record and cell value changes (default)',
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
                            description: 'Which types of changes to watch. Maps to Airtable dataTypes filter. Default: Table Data only.',
                        },
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
                                    name: 'Automation',
                                    value: 'automation',
                                    description: 'Airtable automation action',
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
                                    name: 'Sync',
                                    value: 'sync',
                                    description: 'Airtable Sync',
                                },
                                {
                                    name: 'System',
                                    value: 'system',
                                    description: 'System events (e.g. formula recalculation)',
                                },
                                {
                                    name: 'Anonymous User',
                                    value: 'anonymousUser',
                                    description: 'Unauthenticated users (e.g. public forms)',
                                },
                                {
                                    name: 'Unknown',
                                    value: 'unknown',
                                    description: 'Unknown source',
                                },
                            ],
                            default: [],
                            description: 'Only trigger for changes from these sources. Leave empty for all. Maps to Airtable fromSources filter.',
                        },
                        {
                            displayName: 'Form Submission View ID',
                            name: 'formSubmissionViewId',
                            type: 'string',
                            default: '',
                            description: 'Filter form view submissions to this ViewId. Only relevant when "Form Submission" is selected in From Sources. Maps to Airtable sourceOptions.formSubmission.viewId.',
                        },
                        {
                            displayName: 'Form Page Submission Page ID',
                            name: 'formPageSubmissionPageId',
                            type: 'string',
                            default: '',
                            description: 'Filter interface page submissions to this PageId. Only relevant when "Form Page Submission" is selected in From Sources. Maps to Airtable sourceOptions.formPageSubmission.pageId.',
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
                            description: 'Only trigger when the schema of these fields changes. Requires "Table Fields" in Data Types. Maps to Airtable watchSchemasOfFieldIds. Warning: webhook stops if a listed field is deleted.',
                        },
                        {
                            displayName: 'Include Previous Field Definitions',
                            name: 'includePreviousFieldDefinitions',
                            type: 'boolean',
                            default: false,
                            description: 'Whether to include the previous field name/type in field schema change payloads. Requires "Table Fields" in Data Types. Maps to Airtable includePreviousFieldDefinitions.',
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
                    const includePreviousValues = this.getNodeParameter('includePreviousValues', true);
                    const eventTypes = this.getNodeParameter('eventTypes', ['created', 'updated', 'deleted']);
                    const additionalFields = this.getNodeParameter('additionalFields', {});
                    try {
                        const endpoint = `/bases/${baseId}/webhooks`;
                        // Build filters
                        const filters = {
                            dataTypes: ['tableData'],
                            recordChangeScope: viewId || tableId,
                        };
                        // Map eventTypes to Airtable changeTypes (add/update/remove)
                        const eventToChangeType = { created: 'add', updated: 'update', deleted: 'remove' };
                        if (eventTypes.length > 0 && eventTypes.length < 3) {
                            filters.changeTypes = eventTypes.map(e => eventToChangeType[e]).filter(Boolean);
                        }
                        // watchDataInFieldIds
                        if (fieldsToWatch && fieldsToWatch.length > 0) {
                            filters.watchDataInFieldIds = fieldsToWatch;
                        }
                        // Build includes
                        const includes = {
                            includePreviousCellValues: includePreviousValues,
                        };
                        // includeCellValuesInFieldIds
                        if (fieldsToInclude && fieldsToInclude.length > 0) {
                            if (fieldsToInclude.includes('__all__')) {
                                includes.includeCellValuesInFieldIds = 'all';
                            } else {
                                includes.includeCellValuesInFieldIds = fieldsToInclude;
                            }
                        }
                        // Advanced: dataTypes override
                        if (additionalFields.dataTypes && Array.isArray(additionalFields.dataTypes) && additionalFields.dataTypes.length > 0) {
                            filters.dataTypes = additionalFields.dataTypes;
                        }
                        // Advanced: fromSources
                        if (additionalFields.fromSources && Array.isArray(additionalFields.fromSources) && additionalFields.fromSources.length > 0) {
                            filters.fromSources = additionalFields.fromSources;
                        }
                        // Advanced: sourceOptions
                        const sourceOptions = {};
                        if (additionalFields.formSubmissionViewId) {
                            sourceOptions.formSubmission = { viewId: additionalFields.formSubmissionViewId };
                        }
                        if (additionalFields.formPageSubmissionPageId) {
                            sourceOptions.formPageSubmission = { pageId: additionalFields.formPageSubmissionPageId };
                        }
                        if (Object.keys(sourceOptions).length > 0) {
                            filters.sourceOptions = sourceOptions;
                        }
                        // Advanced: watchSchemasOfFieldIds
                        if (additionalFields.watchSchemasOfFieldIds && Array.isArray(additionalFields.watchSchemasOfFieldIds) && additionalFields.watchSchemasOfFieldIds.length > 0) {
                            filters.watchSchemasOfFieldIds = additionalFields.watchSchemasOfFieldIds;
                        }
                        // Advanced: includePreviousFieldDefinitions
                        if (additionalFields.includePreviousFieldDefinitions === true) {
                            includes.includePreviousFieldDefinitions = true;
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
            // v2.3.2: respect the user's Data Types selection when emitting events.
            // Schema/metadata events were previously emitted unconditionally, which
            // broke downstream workflows expecting only row events.
            const dataTypes = (webhookData.additionalFields && Array.isArray(webhookData.additionalFields.dataTypes) && webhookData.additionalFields.dataTypes.length > 0)
                ? webhookData.additionalFields.dataTypes
                : ['tableData'];
            const emitTableFields = dataTypes.includes('tableFields');
            const emitTableMetadata = dataTypes.includes('tableMetadata');

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

                        // View-scoped record changes (when recordChangeScope is a view)
                        if (tableData.changedViewsById) {
                            for (const viewId in tableData.changedViewsById) {
                                const viewData = tableData.changedViewsById[viewId];
                                if (viewData.createdRecordsById && eventTypes.includes('created')) {
                                    for (const recordId in viewData.createdRecordsById) {
                                        const record = viewData.createdRecordsById[recordId];
                                        formattedPayloads.push({
                                            eventType: 'created',
                                            recordId,
                                            tableId,
                                            viewId,
                                            createdTime: record.createdTime,
                                            fields: resolveCellValues(record.cellValuesByFieldId),
                                            source,
                                            changedBy,
                                            timestamp: payload.timestamp,
                                        });
                                    }
                                }
                                if (viewData.changedRecordsById && eventTypes.includes('updated')) {
                                    for (const recordId in viewData.changedRecordsById) {
                                        const recordData = viewData.changedRecordsById[recordId];
                                        const currentFields = resolveCellValues(recordData.current ? recordData.current.cellValuesByFieldId : null);
                                        const previousFields = resolveCellValues(recordData.previous ? recordData.previous.cellValuesByFieldId : null);
                                        const unchangedFields = resolveCellValues(recordData.unchanged ? recordData.unchanged.cellValuesByFieldId : null);
                                        const changedFields = Object.keys(currentFields);
                                        formattedPayloads.push({
                                            eventType: 'updated',
                                            recordId,
                                            tableId,
                                            viewId,
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
                                if (viewData.destroyedRecordIds && eventTypes.includes('deleted')) {
                                    for (const recordId of viewData.destroyedRecordIds) {
                                        formattedPayloads.push({
                                            eventType: 'deleted',
                                            recordId,
                                            tableId,
                                            viewId,
                                            source,
                                            changedBy,
                                            timestamp: payload.timestamp,
                                        });
                                    }
                                }
                            }
                        }

                        // Field schema changes (tableFields dataType)
                        if (emitTableFields && tableData.createdFieldsById) {
                            for (const fieldId in tableData.createdFieldsById) {
                                const field = tableData.createdFieldsById[fieldId];
                                formattedPayloads.push({
                                    eventType: 'fieldCreated',
                                    fieldId,
                                    tableId,
                                    name: field.name,
                                    type: field.type,
                                    source,
                                    changedBy,
                                    timestamp: payload.timestamp,
                                });
                            }
                        }
                        if (emitTableFields && tableData.changedFieldsById) {
                            for (const fieldId in tableData.changedFieldsById) {
                                const fieldData = tableData.changedFieldsById[fieldId];
                                const item = {
                                    eventType: 'fieldChanged',
                                    fieldId,
                                    tableId,
                                    current: fieldData.current,
                                    source,
                                    changedBy,
                                    timestamp: payload.timestamp,
                                };
                                if (fieldData.previous) {
                                    item.previous = fieldData.previous;
                                }
                                formattedPayloads.push(item);
                            }
                        }
                        if (emitTableFields && tableData.destroyedFieldIds) {
                            for (const fieldId of tableData.destroyedFieldIds) {
                                formattedPayloads.push({
                                    eventType: 'fieldDeleted',
                                    fieldId,
                                    tableId,
                                    source,
                                    changedBy,
                                    timestamp: payload.timestamp,
                                });
                            }
                        }

                        // Table metadata changes (tableMetadata dataType)
                        if (emitTableMetadata && tableData.changedMetadata) {
                            formattedPayloads.push({
                                eventType: 'metadataChanged',
                                tableId,
                                current: tableData.changedMetadata.current,
                                previous: tableData.changedMetadata.previous,
                                source,
                                changedBy,
                                timestamp: payload.timestamp,
                            });
                        }
                    }
                }

                // Error payloads
                if (payload.error) {
                    formattedPayloads.push({
                        eventType: 'error',
                        error: true,
                        code: payload.code,
                        timestamp: payload.timestamp,
                    });
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
