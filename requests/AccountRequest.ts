import SimpleRequest, {ACCOUNT_TYPE, METHOD, SERVICE} from "./SimpleRequest";

export default class AccountRequest extends SimpleRequest {
	constructor(token?: string) {
		super(SERVICE.ACCOUNT, token);
	}

	async accountsInfo() {
		return await (await this.request(METHOD.GET, '/info')).json();
	}

	async accountInfo(accountType: ACCOUNT_TYPE) {
		return await (await this.request(METHOD.GET, '/info', { param: [accountType.toString()] })).json();
	}
}