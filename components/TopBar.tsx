import type {NextPage} from 'next'
import {useStore} from "../store/MainStore";
import {observer} from "mobx-react";
import React, {useState} from 'react';
import {
	AppBar,
	Button,
	IconButton,
	makeStyles,
	Menu,
	MenuItem,
	Toolbar,
	Typography,
	withStyles
} from "@material-ui/core";
import {useRouter} from "next/dist/client/router";

const useStyles = makeStyles((theme) => ({
	toolbar: {
		justifyContent: "space-around",
		width: "1024px",
		margin: "auto"
	}
}));

export const TopBar: NextPage = observer(() => {
	const [option, setOption] = useState(0);
	const [anchorEl, setAnchorEl] = useState(null);

	const store = useStore();

	const handleClick = (e: any, item: number) => {
		setAnchorEl(e.currentTarget);
		setOption(item);
	}

	const handleClose = () => {
		setAnchorEl(null);
	};

	const Payments = [
		<Typography align="center" variant="subtitle2" gutterBottom key={0}>Standard</Typography>,
		<MenuItem onClick={() => {
			handleClose();
			router.push('/transfer/standard')
		}} key={1}>New Transfer</MenuItem>,
		<MenuItem onClick={() => {
			handleClose();
			router.push('/recipients/standard')
		}} key={2}>Saved Recipients</MenuItem>,
		<MenuItem onClick={handleClose} key={3}>Standing orders</MenuItem>,
		<Typography align="center" variant="subtitle2" key={4}>Multi-Currency</Typography>,
		<MenuItem onClick={() => store.util.createMultiModal = true} disabled={store.user.isMultiOpen} key={5}>Open multi-currency account</MenuItem>,
		<MenuItem onClick={() => {
			handleClose();
			router.push('/transfer/multi')
		}} key={6}>New Transfer</MenuItem>,
		<MenuItem onClick={() => {
			handleClose();
			router.push('/recipients/multi')
		}} key={7}>Saved Recipients</MenuItem>,
		<MenuItem onClick={handleClose} key={8}>Standing orders</MenuItem>
	]

	const Finances = [
		<MenuItem onClick={handleClose} key={1}>Transactions</MenuItem>,
		<MenuItem onClick={handleClose} key={2}>Loans</MenuItem>,
	]

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
					<Button onClick={e => handleClick(e, 1)}>
						Payments
					</Button>
					<Button onClick={e => handleClick(e, 2)}>
						Finances
					</Button>
					<Button onClick={() => {location.replace('/api/auth/logout')}}>
						Logout
					</Button>
				</Toolbar>
			</AppBar>
			<Menu
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				getContentAnchorEl={null}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
				transformOrigin={{ vertical: "top", horizontal: "center" }}
				keepMounted
				onClose={handleClose}
			>
				{option === 1 ? Payments : Finances}
			</Menu>
		</div>
	);
});

export default TopBar;