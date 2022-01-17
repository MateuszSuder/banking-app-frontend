import {SERVICE} from "./SimpleRequest";

export default class RecipientRequest extends Request {
	constructor() {
		super(SERVICE.RECIPIENT);
	}
}