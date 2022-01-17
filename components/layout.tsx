import type {NextPage} from 'next'
import {useStore} from "../store/MainStore";
import {observer} from "mobx-react";
import TopBar from "./TopBar";
import React from "react";

export const Layout: NextPage = observer(({ children }) => {
	const store = useStore();
	return (
		<>
			<TopBar />
			{children}
		</>
	);
});

export default Layout;