"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.airtableApiRequest = airtableApiRequest;
exports.getBases = getBases;
exports.getFields = getFields;
exports.getViews = getViews;
exports.extractFieldInfo = extractFieldInfo;
exports.extractFieldSchemaInfo = extractFieldSchemaInfo;
exports.extractTableMetadataInfo = extractTableMetadataInfo;
async function airtableApiRequest(method, endpoint, body = {}, query = {}, uri) {
    const credentials = await this.getCredentials('airtableApi');
    const httpMethod = method;
    const options = {
        method: httpMethod,
        url: uri || `https://api.airtable.com/v0${endpoint}`,
        headers: {
            Authorization: `Bearer ${credentials.apiKey}`,
            'Content-Type': 'application/json',
        },
    };
    if (Object.keys(body).length > 0) {
        options.body = body;
    }
    if (Object.keys(query).length > 0) {
        options.qs = query;
    }
    options.json = true;
    try {
        const response = await this.helpers.request(options);
        return response;
    }
    catch (error) {
        throw error;
    }
}
function getFieldsByTableId(tableId, data) {
    if (!tableId || !data || !data.tables || !Array.isArray(data.tables)) {
        return null;
    }
    const table = data.tables.find((table) => table.id === tableId);
    return table ? table.fields : null;
}
async function getBases() {
    const endpoint = '/meta/bases';
    const { bases } = await airtableApiRequest.call(this, 'GET', endpoint);
    return bases;
}
async function getViews(baseId, tableId) {
    try {
        const endpoint = `/meta/bases/${baseId}/tables`;
        const response = await airtableApiRequest.call(this, 'GET', endpoint);
        if (!response.tables || !Array.isArray(response.tables)) {
            return [];
        }
        const table = response.tables.find((t) => t.id === tableId);
        if (!table || !table.views || !Array.isArray(table.views)) {
            return [];
        }
        return table.views.map((view) => ({
            id: view.id,
            name: view.name,
            type: view.type || 'unknown',
        }));
    }
    catch (error) {
        throw error;
    }
}
async function getFields(baseId, tableId) {
    try {
        const endpoint = `/meta/bases/${baseId}/tables`;
        const response = await airtableApiRequest.call(this, 'GET', endpoint);
        const fields = getFieldsByTableId(tableId, response);
        if (!fields) {
            return [];
        }
        return fields.map((field) => ({
            id: field.id,
            name: field.name,
            type: field.type || 'unknown',
        }));
    }
    catch (error) {
        throw error;
    }
}
function extractFieldInfo(changedRecordsById, fieldsToInclude = [], fieldsByIdMap = {}) {
    const results = [];
    for (const recordId in changedRecordsById) {
        const recordData = changedRecordsById[recordId];
        const { current, previous, unchanged } = recordData;
        if (current && current.cellValuesByFieldId) {
            for (const fieldId in current.cellValuesByFieldId) {
                if (!previous || !previous.cellValuesByFieldId || !(fieldId in previous.cellValuesByFieldId)) {
                    continue;
                }
                const currentValue = current.cellValuesByFieldId[fieldId];
                const previousValue = previous.cellValuesByFieldId[fieldId];
                if (JSON.stringify(currentValue) !== JSON.stringify(previousValue)) {
                    const includedData = [];
                    if (unchanged && unchanged.cellValuesByFieldId) {
                        for (const [fieldId, value] of Object.entries(unchanged.cellValuesByFieldId)) {
                            includedData.push({ fieldId, value });
                        }
                    }
                    const result = {
                        recordId,
                        fieldChanged: {
                            id: fieldId,
                        },
                        values: {
                            current: currentValue,
                            previous: previousValue,
                        },
                        includedData,
                        changeType: 'recordFieldValue',
                    };
                    results.push(result);
                }
            }
        }
    }
    return results;
}
function extractFieldSchemaInfo(changedFieldsById) {
    const results = [];
    for (const fieldId in changedFieldsById) {
        const fieldData = changedFieldsById[fieldId];
        const { current, previous } = fieldData;
        const result = {
            fieldId,
            schemaChange: {
                current: current || {},
                previous: previous || {},
            },
            changeType: 'fieldSchema',
        };
        results.push(result);
    }
    return results;
}
function extractTableMetadataInfo(changedMetadata) {
    const { current, previous } = changedMetadata;
    const result = {
        tableMetadataChange: {
            current: current || {},
            previous: previous || {},
        },
        changeType: 'tableMetadata',
    };
    return [result];
}
//# sourceMappingURL=GenericFunctions.js.map