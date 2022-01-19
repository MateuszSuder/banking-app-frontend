import type {NextPage} from 'next'
import {useStore} from "../store/MainStore";
import {observer} from "mobx-react";
import React from 'react';
import {AppBar, Button, IconButton, makeStyles, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';

export const TopBar: NextPage = observer(() => {
	const store = useStore();
	return (
		<div>
			<AppBar position="static">
				<Toolbar>
					<IconButton edge="start" color="inherit" aria-label="menu">
						<MenuIcon />
					</IconButton>
					<Typography variant="h6">
						News
					</Typography>
					<Button color="inherit" onClick={() => {location.replace('/api/auth/logout')}}>Logout</Button>
				</Toolbar>
			</AppBar>
		</div>
	);
});

export default TopBar;