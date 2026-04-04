"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AirtableTrigger = void 0;
const GenericFunctions_1 = require("./GenericFunctions");
class AirtableTrigger {
    constructor() {
        this.description = {
            displayName: 'Instant Airtable Trigger',
            name: 'airtableTrigger',
            icon: 'file:nodelogo.svg',
            group: ['trigger'],
            version: 1,
            description: 'Instantly handles Airtable events via webhooks. Made by vwork Digital.',
            defaults: {
                name: 'Instant Airtable Trigger',
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
                    displayName: 'Base Name or ID',
                    name: 'base',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getBases',
                    },
                    required: true,
                    default: '',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                },
                {
                    displayName: 'Table Name or ID',
                    name: 'table',
                    type: 'options',
                    typeOptions: {
                        loadOptionsMethod: 'getTables',
                        loadOptionsDependsOn: ['base'],
                    },
                    required: true,
                    default: '',
                    description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                },
                {
                    displayName: 'Fields to Watch For Changes',
                    name: 'fieldsToWatch',
                    type: 'multiOptions',
                    typeOptions: {
                        loadOptionsMethod: 'getFields',
                        loadOptionsDependsOn: ['base', 'table'],
                    },
                    default: [],
                    description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                },
                {
                    displayName: 'Extra Fields to Include in Output',
                    name: 'fieldsToInclude',
                    type: 'multiOptions',
                    typeOptions: {
                        loadOptionsMethod: 'getFields',
                        loadOptionsDependsOn: ['base', 'table'],
                    },
                    default: [],
                    description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                },
                {
                    displayName: 'Include Previous Cell Values?',
                    name: 'includePreviousValues',
                    type: 'boolean',
                    default: true,
                    description: 'Whether to include previous field values in the output',
                },
                {
                    displayName: 'Event Types',
                    name: 'eventTypes',
                    type: 'multiOptions',
                    options: [
                        {
                            name: 'Record Created',
                            value: 'add',
                            description: 'Trigger when a record is created',
                        },
                        {
                            name: 'Record Updated',
                            value: 'update',
                            description: 'Trigger when a record is updated',
                        },
                        {
                            name: 'Record Deleted',
                            value: 'remove',
                            description: 'Trigger when a record is deleted',
                        },
                    ],
                    required: true,
                    default: ['update'],
                    description: 'The events to listen for',
                },
                {
                    displayName: 'Additional Fields',
                    name: 'additionalFields',
                    type: 'collection',
                    placeholder: 'Add Field',
                    default: {},
                    options: [
                        {
                            displayName: 'Data Types',
                            name: 'dataTypes',
                            type: 'multiOptions',
                            options: [
                                {
                                    name: 'Table Data (Record and Cell Value Changes)',
                                    value: 'tableData',
                                },
                                {
                                    name: 'Table Fields (Field Changes)',
                                    value: 'tableFields',
                                },
                                {
                                    name: 'Table Metadata (Table Name and Description Changes)',
                                    value: 'tableMetadata',
                                },
                            ],
                            default: ['tableData'],
                            description: 'Only generate payloads that contain changes affecting objects of these types',
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
                                    name: 'Automation (Via Automation Action)',
                                    value: 'automation',
                                },
                                {
                                    name: 'Client (User via Web or Mobile Clients)',
                                    value: 'client',
                                },
                                {
                                    name: 'Form Page Submission (Interface Forms)',
                                    value: 'formPageSubmission',
                                },
                                {
                                    name: 'Form Submission (Form View)',
                                    value: 'formSubmission',
                                },
                                {
                                    name: 'Public API (Via Airtable API)',
                                    value: 'publicApi',
                                },
                                {
                                    name: 'Sync (Airtable Sync)',
                                    value: 'sync',
                                },
                                {
                                    name: 'System (System Events)',
                                    value: 'system',
                                },
                                {
                                    name: 'Unknown',
                                    value: 'unknown',
                                },
                            ],
                            default: [],
                            description: 'Only generate payloads for changes from these sources. If omitted, changes from all sources are reported.',
                        },
                        {
                            displayName: 'Source Options',
                            name: 'sourceOptions',
                            type: 'string',
                            default: '',
                            placeholder: '{"formPageSubmission":{"pageId":"page123"},"formSubmission":{"viewId":"view456"}}',
                            description: 'Additional options for source filtering in JSON format. Allows filtering form view submissions by ViewId, or interface form submissions by PageId.',
                        },
                        {
                            displayName: 'Watch Schemas of Field IDs',
                            name: 'watchSchemasOfFieldIds',
                            type: 'multiOptions',
                            typeOptions: {
                                loadOptionsMethod: 'getFields',
                                loadOptionsDependsOn: ['base', 'table'],
                            },
                            default: [],
                            description: 'Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
                                        recordChangeScope: tableId,
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