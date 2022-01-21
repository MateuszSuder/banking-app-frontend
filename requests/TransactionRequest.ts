import SimpleRequest, {ACCOUNT_TYPE, METHOD, SERVICE} from "./SimpleRequest";

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

export interface TransactionListInput {
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

export interface TransactionPage {
	transactions:     Transaction[];
	paginationOutput: PaginationOutput;
}

export interface PaginationOutput {
	count: number;
}

export interface Transaction {
	from:            string;
	receiverInfo:    ReceiverInfo;
	title:           string;
	sendValue:       SendValue;
	transactionType: string;
}

export interface ReceiverInfo {
	accountNumber: string;
	recipientName: string;
}

export interface SendValue {
	currency: string;
	amount:   number;
}

export default class TransactionRequest extends SimpleRequest {
	constructor(token?: string, code?: string) {
		super(SERVICE.TRANSACTION, token, code);
	}

	async getTransactionPage(accountType: ACCOUNT_TYPE, input: TransactionListInput): Promise<TransactionPage> {
		return await (await this.request(METHOD.POST, '/', { body: input, param: [accountType.toString()] })).json()
	}

	async exportCSV(accountType: ACCOUNT_TYPE): Promise<String> {
		return await (await this.request(METHOD.GET, '/export', { param: [accountType.toString()], postParam: true })).text()
	}
}