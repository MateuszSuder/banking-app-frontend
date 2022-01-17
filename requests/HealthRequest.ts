import {SERVICE} from "./SimpleRequest";

export default class HealthRequest extends Request {
	constructor() {
		super(SERVICE.HEALTH);
	}
}