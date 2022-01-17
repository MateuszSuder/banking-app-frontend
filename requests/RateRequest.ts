import {SERVICE} from "./SimpleRequest";

export default class RateRequest extends Request {
	constructor() {
		super(SERVICE.RATE);
	}
}