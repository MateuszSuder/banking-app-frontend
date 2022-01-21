import {makeAutoObservable} from "mobx";
import {AccountInfo, Loan} from "../../requests/AccountRequest";

export default class UserStore {
	userAccounts?: AccountInfo[];

	constructor() {
		makeAutoObservable(this);
	}

	setAccounts(accs: AccountInfo[]) {
		this.userAccounts = accs;
	}

	getAccountWithType(type: string) {
		if(type === 'standard') {
			return this.standard
		}
		if(type === 'multi') {
			return this.multi
		}

		throw new Error('Unknown type');
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

	get hasActiveLoan(): boolean {
		if(!this.standard?.loans) {
			return false;
		}
		return this.standard.loans[this.standard.loans.length - 1].interest > 0 ||
			this.standard.loans[this.standard.loans.length - 1].installments[this.standard.loans[this.standard.loans.length - 1].installments.length - 1].amountLeftToPay > 0
	}

	get getLastLoan(): Loan | undefined {
		if(this.standard?.loans) {
			return this.standard.loans[this.standard.loans.length - 1];
		}
	}
}