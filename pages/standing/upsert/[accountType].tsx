import type {NextPage} from 'next'
import {observer} from "mobx-react";
import {useStore} from "../../../store/MainStore";
import React, {useEffect, useState} from "react";
import {Button, Input, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import CodeGen from "../../../components/Forms/CodeGen";
import {useRouter} from "next/dist/client/router";
import {AccountInfo} from "../../../requests/AccountRequest";

type Props = {

};
export const UpsertStandingOrder: NextPage = observer((props: Props) => {
	const [account, setAccount] = useState<AccountInfo | null>(null);

	const [from, setFrom] = useState('');
	const [recipientIban, setRecipientIban] = useState('');
	const [recipientName, setRecipientName] = useState('');
	const [title, setTitle] = useState('');
	const [currency, setCurrency] = useState('');
	const [amount, setAmount] = useState('');
	const [code, setCode] = useState('');

	const store = useStore();
	const router = useRouter();

	const { accountType, id } = router.query;

	const submit = () => {
		fetch(`/api/standing/${id ? 'modify' : 'add'}/` + accountType, {
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
				code,
				id
			})
		}).then(response => {
			if(response.ok)
				return response.json()
			else throw response.json()
		})
			.then(d => {
				const a = store.user.getAccountWithType(accountType as string);
				if(a) {
					a.standingOrders = d;
				}
				store.util.modal = "Success"
				router.push('/standing/' + accountType);
			})
			.catch(async e => {
				const err = await e;
				store.util.modal = err.message + '. ' + err.message_details;
			})
	}

	useEffect(() => {
		if(accountType && !['standard', 'multi'].includes(accountType as string)) {
			router.replace('/dashboard');
		} else {
			if(store.user.userAccounts) {
				const acc = store.user.getAccountWithType(accountType as string);
				if(!acc) {
					router.replace('/dashboard');
					return;
				}
				if(id) {
					const orders = acc.standingOrders;
					if(orders) {
						const order = orders.find(el => el.id === id);
						if(order) {
							const { title, to, value } = order;
							setRecipientIban(to.accountNumber);
							setTitle(title);
							setRecipientName(to.recipientName);
							setCurrency(value.currency);
							setAmount(value.amount.toString());
						}
					}
				}
				setAccount(acc);
				setFrom(acc.id);
			}
		}
	}, [accountType, store.user.userAccounts])

	return (
		<form className="transfer-form" noValidate>
			<Typography align="center" variant="h4" gutterBottom>Standing order</Typography>
			<TextField label="From" disabled value={from} fullWidth />
			<TextField label="Recipient IBAN" value={recipientIban} onChange={e => setRecipientIban(e.target.value)}  fullWidth />
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
							account &&
							account.currencies.map((curr, i) => <MenuItem value={curr.currency} key={i}>{curr.currency}</MenuItem>)
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
			<Button variant="contained" color="primary" onClick={submit}>Save standing order</Button>
		</form>
	);
});

export default UpsertStandingOrder;