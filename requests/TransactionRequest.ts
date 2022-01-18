import SimpleRequest, {SERVICE} from "./SimpleRequest";

export enum IOFilter {
	ANY = 'ANY',
	INCOMING = 'INCOMING',
	OUTGOING = 'OUTGOING'
}

export enum TransactionType {
	MANUAL = 'MANUAL',
	STANDING_ORDER = 'STANDING_ORDER',
	LOAN_PAYMENT = 'LOAN_PAYMENT',
	EXCHANGE = 'EXCHANGE'
}

export enum SortType {
	DATE_ASC = 'DATE_ASC',
	DATE_DESC = 'DATE_DESC',
	VALUE_ASC = 'VALUE_ASC',
	VALUE_DESC = 'VALUE_DESC'
}

export interface StandingOrderList {
	pagination:      Pagination;
	ioFilter:        IOFilter;
	startDate:       Date;
	endDate:         Date;
	recipientName:   string;
	recipientIban:   string;
	amountFrom:      number;
	amountTo:        number;
	currency:        string;
	title:           string;
	sortType:        SortType;
	transactionType: TransactionType;
}

export interface Pagination {
	offset: number;
	limit:  number;
}


export default class TransactionRequest extends SimpleRequest {
	constructor(token?: string) {
		super(SERVICE.TRANSACTION, token);
	}

	async getTransactionPage() {

	}
}