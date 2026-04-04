import { IExecuteFunctions, IHookFunctions, IDataObject, ILoadOptionsFunctions, IWebhookFunctions } from 'n8n-workflow';
export declare function airtableApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions | IWebhookFunctions, method: string, endpoint: string, body?: IDataObject, query?: IDataObject, uri?: string): Promise<any>;
export declare function getBases(this: ILoadOptionsFunctions): Promise<Array<{
    id: string;
    name: string;
}>>;
export declare function getFields(this: ILoadOptionsFunctions, baseId: string, tableId: string): Promise<Array<{
    id: string;
    name: string;
    type: string;
}>>;
export declare function extractFieldInfo(changedRecordsById: any, fieldsToInclude?: string[], fieldsByIdMap?: Record<string, {
    name: string;
}>): any[];
export declare function extractFieldSchemaInfo(changedFieldsById: any): any[];
export declare function extractTableMetadataInfo(changedMetadata: any): any[];
