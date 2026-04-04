import type { IHookFunctions, IWebhookFunctions, ILoadOptionsFunctions, INodePropertyOptions, INodeType, INodeTypeDescription, IWebhookResponseData } from 'n8n-workflow';
export declare class AirtableTrigger implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getBases(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getTables(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
            getFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]>;
        };
    };
    webhookMethods: {
        default: {
            checkExists(this: IHookFunctions): Promise<boolean>;
            create(this: IHookFunctions): Promise<boolean>;
            delete(this: IHookFunctions): Promise<boolean>;
        };
    };
    webhook(this: IWebhookFunctions): Promise<IWebhookResponseData>;
}
