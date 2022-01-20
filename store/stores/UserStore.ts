import {makeAutoObservable} from "mobx";
import {AccountInfo} from "../../requests/AccountRequest";

export default class UserStore {
	userAccounts?: AccountInfo[];

	constructor() {
		makeAutoObservable(this);
	}

	setAccounts(accs: AccountInfo[]) {
		this.userAccounts = accs;
	}

	get isMultiOpen() {
		return this.userAccounts?.some(el => el.id[11] === '2')
	}

	get standard() {
		return this.userAccounts?.find(el => el.id[11] === '1');
	}

	get multi() {
		return this.userAccounts?.find(el => el.id[11] === '2');
	}
}