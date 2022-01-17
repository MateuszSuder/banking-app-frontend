import {makeAutoObservable} from "mobx";

export default class UserStore {
	test = "123";

	constructor() {
		makeAutoObservable(this);
	}

	setTest() {
		this.test = "abc";
	}
}