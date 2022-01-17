import {SERVICE} from "./SimpleRequest";

export default class StandingRequest extends Request {
	constructor() {
		super(SERVICE.STANDING_ORDER);
	}
}