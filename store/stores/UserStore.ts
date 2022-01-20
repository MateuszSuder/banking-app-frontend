import {makeAutoObservable} from "mobx";
import {AccountInfo} from "../../requests/AccountRequest";

export default class UserStore {
	userAccounts?: AccountInfo[];
	noAccount: boolean = false;

	constructor() {
		makeAutoObservable(this);
	}

	setAccounts(accs: AccountInfo[]) {
		this.userAccounts = accs;
	}

	get isMultiOpen() {
		return this.userAccounts?.some(el => el.id[11] === '2')
	}
}