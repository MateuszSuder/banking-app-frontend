import SimpleRequest, {ACCOUNT_TYPE, METHOD, SERVICE} from "./SimpleRequest";
import {TransferInput} from "./AccountRequest";

export interface StandingOrder {
	id:                string;
	title:             string;
	to:                To;
	nextPayment:       Date;
	lastPaymentFailed: boolean;
	value:             Value;
}

export interface To {
	accountNumber: string;
	recipientName: string;
}

export interface Value {
	currency: string;
	amount:   number;
}


export default class StandingRequest extends SimpleRequest {
	constructor(token?: string, code?: string) {
		super(SERVICE.STANDING_ORDER, token, code);
	}

	async addStandingOrder(accountType: ACCOUNT_TYPE, input: TransferInput): Promise<StandingOrder[]> {
		return await (await this.request(METHOD.POST, '/',{ param: [accountType.toString()], body: input })).json();
	}

	async deleteStandingOrder(accountType: ACCOUNT_TYPE, standingOrderId: string): Promise<StandingOrder[]> {
		return await (await this.request(METHOD.DELETE, '/',{ param: [accountType.toString(), standingOrderId] })).json();
	}

	async modifyStandingOrder(accountType: ACCOUNT_TYPE, standingOrderId: string, input: TransferInput): Promise<StandingOrder[]> {
		return await (await this.request(METHOD.PUT, '/',{ param: [accountType.toString(), standingOrderId], body: input })).json();
	}
}