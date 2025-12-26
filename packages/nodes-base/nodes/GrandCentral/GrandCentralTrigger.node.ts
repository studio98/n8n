import type {
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IHookFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { gcApiRequest } from './GenericFunctions';

// import {
// 	createHmac,
// } from 'crypto';

export class GrandCentralTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GrandCentral Trigger',
		name: 'grandCentralTrigger',
		icon: 'file:grandcentral.svg',
		group: ['trigger'],
		version: 1,
		description: 'Starts the workflow when GrandCentral events occur.',
		defaults: {
			name: 'GrandCentral Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'grandCentral',
				required: true,
				displayOptions: {
					show: {
						authentication: ['apiKey'],
					},
				},
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
				displayName: 'Authentication',
				name: 'authentication',
				type: 'options',
				options: [
					{
						name: 'Access Token',
						value: 'apiKey',
					},
				],
				default: 'apiKey',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				default: '',
				required: true,
				typeOptions: {
					loadOptionsMethod: 'getEvents',
				},

				options: [],
				description: 'The resource ID to subscribe to. The resource can be a task or project.',
			},
		],
	};

	methods = {
		loadOptions: {
			// Get all the available workspaces to display them to user so that they can
			// select them easily
			async getEvents(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const { data } = await gcApiRequest.call(this, { action: 'webhookEvents' });
				data.unshift({
					name: '',
					value: '',
				});
				return data;
			},
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				const event = this.getNodeParameter('event') as string;

				const { data } = await gcApiRequest.call(this, { action: 'getWebhooks' });
				for (const webhook of data) {
					if (webhook.url == webhookUrl && webhook.triggers.includes(event)) {
						webhookData.webhookId = webhook.id;
						return true;
					}
				}

				// If it did not error then the webhook exists
				return false;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				const webhookUrl = this.getNodeWebhookUrl('default') as string;

				const trigger = this.getNodeParameter('event') as string;

				const body = {
					trigger,
					url: webhookUrl,
				};

				const responseData = await gcApiRequest.call(this, { action: 'createWebhook', ...body });

				webhookData.webhookId = responseData.data.id as string;

				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (webhookData.webhookId !== undefined) {
					try {
						await gcApiRequest.call(this, {
							action: 'deleteWebhook',
							webhookId: webhookData.webhookId,
							source: 'n8n',
						});
					} catch (error) {
						return false;
					}

					// Remove from the static workflow data so that it is clear
					// that no webhooks are registered anymore
					delete webhookData.webhookId;
					delete webhookData.webhookEvents;
					delete webhookData.hookSecret;
				}

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();

		return {
			workflowData: [this.helpers.returnJsonArray(req.body as IDataObject[])],
		};
	}
}
