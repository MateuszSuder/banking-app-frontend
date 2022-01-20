import type {NextPage} from 'next'
import {observer} from "mobx-react";
import React, {useEffect, useState} from 'react';
import {
	Button,
	FormControl,
	Input,
	InputAdornment,
	InputLabel,
	makeStyles,
	MenuItem,
	Select,
	TextField, Typography
} from "@material-ui/core";
import {useRouter} from "next/dist/client/router";
import {useStore} from "../../store/MainStore";
import {AccountInfo} from "../../requests/AccountRequest";
import CodeGen from "../../components/Forms/CodeGen";

const useStyles = makeStyles((theme) => ({
	root: {
		'& > *': {
			width: '25ch'
		},
	},
	margin: {
		margin: theme.spacing(1),
	}
}));
export const TopBar: NextPage = observer(() => {
	const [account, setAccount] = useState<AccountInfo | null>(null);
	const [type, setType] = useState('');

	const [from, setFrom] = useState('');
	const [recipientIban, setRecipientIban] = useState('');
	const [recipientName, setRecipientName] = useState('');
	const [title, setTitle] = useState('');
	const [currency, setCurrency] = useState('');
	const [amount, setAmount] = useState('');
	const [code, setCode] = useState('');

	const classes = useStyles();
	const router = useRouter();
	const store = useStore();

	const { accountType, id } = router.query;

	const submit = () => {
		fetch('/api/transfer/' + type, {
			method: 'POST',
			body: JSON.stringify({
				to: {
					accountNumber: recipientIban,
					recipientName: recipientName
				},
				value: {
					currency,
					amount
				},
				title,
				code
			})
		}).then(response => {
			if(response.ok)
				return response.json()
			else throw response.json()
		})
			.then(d => {
				store.util.modal = "Success"
				router.push('/dashboard')
			})
			.catch(async e => {
				const err = await e;
				store.util.modal = err.message + '. ' + err.message_details;
			})
	}

	useEffect(() => {
		setRecipientIban(id as string)
	}, [id])

	useEffect(() => {
		if(accountType && !['standard', 'multi'].includes(accountType as string)) {
			router.replace('/dashboard');
		} else {
			setType(accountType as string === 'standard' ? 'standard' : 'multi');
			console.log(type)
			console.log(accountType)
			if(store.user.userAccounts) {
				const acc = store.user.userAccounts.find(el => el.id[11] === (accountType === 'standard' ? '1' : '2'));
				if(!acc) {
					router.replace('/dashboard');
					return;
				}
				setAccount(acc);
				setFrom(acc.id);
			}
		}
	}, [accountType, store.user.userAccounts])

	return (
		<div>
			<form className="transfer-form" noValidate>
				<Typography align="center" variant="h4" gutterBottom>Transfer</Typography>
				<TextField label="From" disabled value={from}fullWidth />
				<TextField label="Recipient IBAN" disabled={Boolean(id)} value={recipientIban} onChange={e => setRecipientIban(e.target.value)}  fullWidth />
				<TextField label="Recipient name" value={recipientName} onChange={e => setRecipientName(e.target.value)} fullWidth />
				<TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} fullWidth />
				<div className={"value"}>
					<div>
						<InputLabel id="demo-simple-select-label">Currency</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={currency}
							onChange={e => setCurrency(e.target.value as string)}
							fullWidth
						>
							{
								account && account.currencies.map((curr, i) => <MenuItem value={curr.currency} key={i}>{curr.currency}</MenuItem>)
							}
						</Select>
					</div>
					<div>
						<InputLabel htmlFor="standard-adornment-amount">Amount</InputLabel>
						<Input
							id="standard-adornment-amount"
							fullWidth
							value={amount}
							onChange={e => setAmount(e.target.value)}
							startAdornment={<InputAdornment position="start">{ currency }</InputAdornment>}
						/>
					</div>
				</div>
				<div style={{width: "33%"}}>
					<CodeGen onChange={v => setCode(v)} model={code} />
				</div>
				<Button variant="contained" color="primary" onClick={submit}>Send transfer</Button>
			</form>
		</div>
	);
});

export default TopBar;