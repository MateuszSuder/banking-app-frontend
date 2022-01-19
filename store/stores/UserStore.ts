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
}