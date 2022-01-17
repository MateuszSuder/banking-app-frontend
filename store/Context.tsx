import React, { createContext, useContext } from "react";
import MainStore from "./MainStore";

const RootStateContext = createContext<MainStore>(new MainStore());

export const StateProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
	let store = new MainStore();
	return <RootStateContext.Provider value = {store}>{ children }</RootStateContext.Provider>;
}

export const useRootStore = () => useContext(RootStateContext);