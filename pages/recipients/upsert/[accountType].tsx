import type {NextPage} from 'next'
import {observer} from "mobx-react";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/dist/client/router";
import {
	Button,
	Divider,
	TextField,
	Typography
} from "@material-ui/core";
import CodeGen from "../../../components/Forms/CodeGen";
import {useStore} from "../../../store/MainStore";

type Props = {

};
export const AddRecipient: NextPage = observer((props: Props) => {
	const [recipientName, setRecipientName] = useState('');
	const [recipientIban, setRecipientIban] = useState('');
	const [code, setCode] = useState('');
	const router = useRouter();
	const store = useStore();

	const { accountType, id } = router.query;

	const submit = () => {
		fetch('/api/recipients/add/' + accountType, {
			method: 'POST',
			body: JSON.stringify({
				accountNumber: recipientIban,
				recipientName: recipientName,
				code
			})
		})
			.then(response => {
				if(response.ok)
					return response.json()
				else throw response.json()
			})
			.then(d => {
				const a = store.user.getAccountWithType('standard');
			})
			.catch(async e => {
				console.error(e);
			})
	}

	useEffect(() => {
		console.log(id)
	}, [id])

	return (
		<>
			<Typography align="center" variant="h4" gutterBottom>Add recipient</Typography>
			<form className="transfer-form" noValidate>
				<Divider />
				<TextField label="Recipient name" value={recipientName} onChange={e => setRecipientName(e.target.value)} fullWidth />
				<TextField label="Recipient IBAN" value={recipientIban} onChange={e => setRecipientIban(e.target.value)} fullWidth />
				<div style={{width: "33%"}}>
					<CodeGen onChange={v => setCode(v)} model={code} />
				</div>
				<Button variant="contained" color="primary" onClick={submit}>Save recipient</Button>
			</form>
			</>
	);
});

export default AddRecipient;