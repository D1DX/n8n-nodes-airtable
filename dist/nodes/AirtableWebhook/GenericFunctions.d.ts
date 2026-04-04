import { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions } from 'n8n-workflow';
export declare function airtableApiRequest(this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions, method: string, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
