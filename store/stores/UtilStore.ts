import {makeAutoObservable} from "mobx";
import {AccountInfo} from "../../requests/AccountRequest";

export default class UtilStore {
	modal: string | null = null;

	constructor() {
		makeAutoObservable(this);
	}
}