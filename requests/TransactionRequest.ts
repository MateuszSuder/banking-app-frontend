import {SERVICE} from "./SimpleRequest";

export default class TransactionRequest extends Request {
	constructor() {
		super(SERVICE.TRANSACTION);
	}
}