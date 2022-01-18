import SimpleRequest, {METHOD, SERVICE} from "./SimpleRequest";

export interface LoanInput {
	loanAmount:  number;
	loanLength:  number;
	loanRate:    number;
	autoPayment: boolean;
}

export interface LoanInfo {
	loanRate:              number;
	minLoanLengthInMonths: number;
	maxLoanLengthInMonths: number;
	minLoanValue:          number;
	maxLoanValue:          number;
}

export default class LoanRequest extends SimpleRequest {
	constructor(token?: string, code?: string) {
		super(SERVICE.LOAN, token, code);
	}

	async loanInfo(): Promise<LoanInfo> {
		return await(await this.request(METHOD.PUT, '/info')).json();
	}

	async takeLoan(input: LoanInput): Promise<LoanInput> {
		return await(await this.request(METHOD.PUT, '/take')).json();
	}

	async payLoan(input: {amount: number}): Promise<{ amountLeft: number }> {
		return await(await this.request(METHOD.PUT, '/pay', {body: input})).json();
	}

}