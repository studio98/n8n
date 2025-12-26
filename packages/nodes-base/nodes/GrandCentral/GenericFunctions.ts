import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestOptions,
} from 'n8n-workflow';

/**
 * Make an API request to GrandCentral
 *
 */
export async function gcApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	body: object,
	url?: string,
	query?: IDataObject,
): Promise<any> {
	const options: IHttpRequestOptions = {
		headers: { 'Content-Type': 'application/json' },
		method: 'POST',
		body,
		qs: query,
		url: `https://api.grandcentr.al/v1/${url || 'tools'}`,
		json: true,
	};

	if (options.body === null) {
		delete options.body;
	}

	const credentialType = 'grandCentral';
	return await this.helpers.requestWithAuthentication.call(this, credentialType, options);
}
