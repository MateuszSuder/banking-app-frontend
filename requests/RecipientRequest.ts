import SimpleRequest, {ACCOUNT_TYPE, METHOD, SERVICE} from "./SimpleRequest";
import {TransferInput} from "./AccountRequest";

export interface Recipient {
	accountNumber: string;
	recipientName: string;
}

export default class RecipientRequest extends SimpleRequest {
	constructor(token?: string, code?: string) {
		super(SERVICE.RECIPIENT, token, code);
	}

	async addRecipient(accountType: ACCOUNT_TYPE, recipient: Recipient): Promise<Recipient[]> {
		return await(await this.request(METHOD.POST, '/', { param: [accountType.toString()], body: recipient })).json();
	}

	async deleteRecipient(accountType: ACCOUNT_TYPE, recipientIban: string): Promise<Recipient[]> {
		return await(await this.request(METHOD.DELETE, '/', { param: [accountType.toString()], query: [{key: "recipientIban", value: recipientIban}] })).json();
	}

	async modifyRecipient(accountType: ACCOUNT_TYPE, recipient: Recipient): Promise<Recipient[]> {
		return await(await this.request(METHOD.PUT, '/', { param: [accountType.toString()], body: recipient })).json();
	}

	async sendToRecipient(accountType: ACCOUNT_TYPE, input: TransferInput): Promise<Recipient[]> {
		return await(await this.request(METHOD.POST, '/send', { postParam: true, param: [accountType.toString()], body: input })).json();
	}
}