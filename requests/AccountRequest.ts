import SimpleRequest, {ACCOUNT_TYPE, METHOD, SERVICE} from "./SimpleRequest";

export interface TransferInput {
	to:    To;
	value: Value;
	title: string;
}

export interface To {
	accountNumber: string;
	recipientName: string;
}

export interface Value {
	currency: string;
	amount:   number;
}

export interface AccountInfo {
	id:             string;
	currencies:     Currency[];
	loans:          Loan[];
	standingOrders: StandingOrder[];
	alertsList:     AlertsList[];
}

export interface AlertsList {
	name:  string;
	value: string;
	date:  string;
}

export interface Currency {
	currency: string;
	amount:   number;
}

export interface Loan {
	startedAt:    Date;
	endsAt:       Date;
	lentAmount:   number;
	totalToPay:   number;
	installments: Installment[];
	interest:     number;
	autoPayment:  boolean;
}

export interface Installment {
	id:              string;
	amount:          number;
	amountLeftToPay: number;
	paidAt:          string;
}

export interface StandingOrder {
	id:                string;
	title:             string;
	to:                To;
	nextPayment:       Date;
	lastPaymentFailed: boolean;
	value:             Currency;
}

export interface To {
	accountNumber: string;
	recipientName: string;
}

export interface OpenAccountResult {
	IBAN_raw: string;
	IBAN:     string;
}

export default class AccountRequest extends SimpleRequest {
	constructor(token?: string) {
		super(SERVICE.ACCOUNT, token);
	}

	async accountsInfo(): Promise<AccountInfo[]> {
		return await (await this.request(METHOD.GET, '/info')).json();
	}

	async accountInfo(accountType: ACCOUNT_TYPE): Promise<AccountInfo> {
		return await (await this.request(METHOD.GET, '/info', { param: [accountType.toString()] })).json();
	}

	async openAccount(accountType: ACCOUNT_TYPE): Promise<OpenAccountResult> {
		return await (await this.request(METHOD.GET, '/open', { param: [accountType.toString()] })).json();
	}

	async transfer(accountType: ACCOUNT_TYPE, input: TransferInput): Promise<void> {
		return await (await this.request(METHOD.GET, '/open', { param: [accountType.toString()], body: input })).json();
	}

}