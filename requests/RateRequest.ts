import SimpleRequest, {METHOD, SERVICE} from "./SimpleRequest";

export interface RateInfo {
	type:            string;
	rates:           Rate[];
	defaultCurrency: string;
}

export interface Rate {
	currency: string;
	price:    number;
}

export interface ExchangeInput {
	from: From;
	to:   string;
}

export interface From {
	currency: string;
	amount:   number;
}

export interface ExchangeResult extends From {
	rate: number;
}

export default class RateRequest extends SimpleRequest {
	constructor(token?: string) {
		super(SERVICE.RATE, token);
	}

	async ratesInfo(): Promise<RateInfo[]> {
		return await (await this.request(METHOD.GET, '/')).json();
	}

	async rateInfo(input: ExchangeInput): Promise<RateInfo> {
		return await (await this.request(METHOD.GET, '/info', { body: input })).json();
	}

	async exchange(input: ExchangeInput): Promise<ExchangeResult> {
		return await (await this.request(METHOD.POST, '/', { body: input })).json();
	}
}