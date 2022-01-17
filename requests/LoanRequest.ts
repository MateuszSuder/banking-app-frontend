import SimpleRequest, {METHOD, SERVICE} from "./SimpleRequest";

export default class LoanRequest extends SimpleRequest {
	constructor(token?: string) {
		super(SERVICE.LOAN, token);
	}

	async payLoan(input: {amount: number}): Promise<{ amountLeft: number }> {
		return await(await this.request(METHOD.PUT, '/pay', {body: input})).json();
	}
}