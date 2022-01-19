import {makeAutoObservable} from "mobx";
import {UserStore, UtilStore} from "./stores";
import {useMemo} from "react";

let store: MainStore;

export default class MainStore {
	user: UserStore;
	util: UtilStore;

	constructor() {
		this.user = new UserStore();
		this.util = new UtilStore();
		makeAutoObservable(this);
	}
}

export function useStore() {
	function initializeStore() {
		const _store = store ?? new MainStore();
		// For SSG and SSR always create a new store
		if (typeof window === 'undefined') return _store;
		// Create the store once in the client
		if (!store) store = _store;
		return _store;
	}

	return useMemo(() => initializeStore(), []);
}
