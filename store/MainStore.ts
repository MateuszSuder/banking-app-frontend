import {makeAutoObservable} from "mobx";
import {UserStore} from "./stores";
import {useMemo} from "react";

let store: MainStore;

export default class MainStore {
	user: UserStore;

	constructor() {
		this.user = new UserStore();
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
