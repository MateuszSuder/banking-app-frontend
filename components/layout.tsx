import type {NextPage} from 'next'
import {observer} from "mobx-react";
import TopBar from "./TopBar";
import React from "react";


export const Layout: NextPage = observer(({ children }) => {
	return (
		<>
			<TopBar />
			<div style={{width: "1024px", margin: "auto", paddingTop: "2rem"}}>
				{children}
			</div>
		</>
	);
});

export default Layout;