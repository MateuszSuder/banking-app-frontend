export const enum SERVICE {
	HEALTH = 'health',
	ACCOUNT = 'account',
	LOAN = 'loan',
	RATE = 'rate',
	RECIPIENT = 'recipient',
	STANDING_ORDER = 'standing',
	TRANSACTION = 'transaction'
}

export enum METHOD {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE'
}

export type QueryParam = {key: string, value: string}

export type OptionalInputs = {
	body?: object,
	query?: Array<QueryParam>,
	param?: Array<string>
	cookie?: string;
	code?: string;
	postParam?: boolean;
}

export enum ACCOUNT_TYPE {
	STANDARD = 'standard',
	MULTI = 'multi'
}

export default abstract class SimpleRequest {
	private readonly baseURL = "http://localhost:8080/api";
	private readonly serviceEndpoint: string;
	private readonly accessToken?: string;

	protected constructor(service: SERVICE, token: string | undefined) {
		this.serviceEndpoint = service;
		this.accessToken = token;
	}

	protected get fullURL() {
		return this.baseURL + "/" + this.serviceEndpoint;
	}

	protected async request(method: METHOD, endpoint: string, optional?: OptionalInputs) {
		console.log(this.accessToken);
		let paramString = '';
		if(optional?.param) {
			for(const p of optional.param) {
				paramString += "/" + p;
			}
		}
		let url = new URL(this.fullURL + optional?.postParam ? (paramString + endpoint) : (endpoint + paramString));
		console.log(url);
		const params = new URLSearchParams();
		if (optional?.query) {
			for (const q of optional.query) {
				params.set(q.key, q.value);
			}
		}
		url.search = params.toString();
		return await fetch(url.toString(), {
			method: method,
			headers: {
				'Content-type': 'application/json',
				'Authorization': `Bearer ${this.accessToken}`,
				'X-Code': '957423'
			},
			credentials: 'include',
			body: JSON.stringify(optional?.body)
		})
	}
}