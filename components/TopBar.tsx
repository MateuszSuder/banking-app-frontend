import type {NextPage} from 'next'
import {useStore} from "../store/MainStore";
import {observer} from "mobx-react";
import React from 'react';
import {AppBar, Button, IconButton, makeStyles, Toolbar, Typography} from "@material-ui/core";
import {useRouter} from "next/dist/client/router";

const useStyles = makeStyles((theme) => ({
	toolbar: {
		justifyContent: "space-around",
		width: "1024px",
		margin: "auto"
	}
}));

export const TopBar: NextPage = observer(() => {
	const router = useRouter();
	return (
		<div>
			<AppBar position="static">
				<Toolbar style={{
						justifyContent: "space-around",
						width: "1024px",
						margin: "auto"
				}}>
					<Button onClick={() => router.push('/dashboard')}>
						Dashboard
					</Button>
					<Button onClick={() => {location.replace('/api/auth/logout')}}>
						Logout
					</Button>
				</Toolbar>
			</AppBar>
		</div>
	);
});

export default TopBar;