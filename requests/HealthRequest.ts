import SimpleRequest, {METHOD, SERVICE} from "./SimpleRequest";

export default class HealthRequest extends SimpleRequest {
	constructor() {
		super(SERVICE.HEALTH);
	}

	async checkHealth(): Promise<string> {
		return await (await this.request(METHOD.GET, '/')).text();
	}
}