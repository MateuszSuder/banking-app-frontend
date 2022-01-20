import type {NextPage} from 'next'
import {observer} from "mobx-react";
import {useStore} from "../../store/MainStore";
import {useEffect, useState} from "react";
import {Recipient} from "../../requests/RecipientRequest";
import {useRouter} from "next/dist/client/router";
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import SendIcon from '@material-ui/icons/Send';
import {
	Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
	Divider,
	Grid, Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer, TableHead,
	TableRow,
	Typography
} from "@material-ui/core";
import SimpleModal from "../../components/Modal/SimpleModal";
import CodeGen from "../../components/Forms/CodeGen";

type Props = {

};
export const RecipientsList: NextPage = observer((props: Props) => {
	const [recipients, setRecipients] = useState<Recipient[] | null>(null);
	const [deletingIban, setDeletingIban] = useState('');
	const [code, setCode] = useState('');
	const [error, setError] = useState('');

	const store = useStore();
	const router = useRouter();

	const { accountType } = router.query;

	const deleteRecipient = (recipientIban: string) => {
		fetch('/api/recipients/delete/' + accountType + '?id=' + recipientIban, {
			method: 'POST',
			body: JSON.stringify({
				code
			})
		})
			.then(response => {
				if(response.ok)
					return response.json()
				else throw response.json()
			})
			.then(d => {
				setDeletingIban('');
				setCode('');
				const a = store.user.getAccountWithType('standard');
				if(a) {
					a.savedRecipients = d;
				}
				prepareRecipients();
			})
			.catch(async e => {
				setError((await (e)).message_details)
			})
	}

	const prepareRecipients = () => {
		if(store.user.userAccounts) {
			if(accountType === 'standard' && store.user.standard?.savedRecipients) {
				setRecipients(store.user.standard.savedRecipients)
			} else if(accountType === 'multi' && store.user.multi?.savedRecipients) {
				setRecipients(store.user.multi.savedRecipients)
			} else {
				if(!['standard', 'multi'].includes(accountType as string)) {
					router.push('/dashboard')
				}
			}
		}
	}

	const modifyRecipient = (recipientIban: string) => {
		router.push('/recipients/upsert/standard?id=' + recipientIban);
	}

	useEffect(() => {
		prepareRecipients();
	}, [store.user.userAccounts])

	return (
		<div style={{width: "100%"}}>
			<Typography align="center" variant="h4" gutterBottom>Recipients</Typography>
			<Typography align="center" variant="h6" gutterBottom style={{textTransform: "capitalize"}}>{ accountType }</Typography>
			<Grid
				container
				spacing={0}
				direction="column"
				alignItems="center"
				justifyContent="center"
				style={{marginBottom: "2rem", marginTop: "1rem"}}
			>
				<Grid item xs={3}>
					<Button variant="outlined" onClick={() => router.push('/recipients/upsert/' + accountType)}>Add new recipient</Button>
				</Grid>
			</Grid>

			<Divider />
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell width="10%">#</TableCell>
							<TableCell align="center" width="35%">Recipient IBAN</TableCell>
							<TableCell align="center" width="35%">Recipient name</TableCell>
							<TableCell align="center" width="20%"></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{recipients && recipients.map((recipient, i) => (
							<TableRow key={recipient.accountNumber}>
								<TableCell component="th" scope="row" width="10%">
									{i + 1}
								</TableCell>
								<TableCell align="center" width="35%">{recipient.accountNumber}</TableCell>
								<TableCell align="center" width="35%">{recipient.recipientName}</TableCell>
								<TableCell align="center" width="20%">
									<DeleteIcon cursor="pointer" onClick={() => setDeletingIban(recipient.accountNumber)} />
									<EditIcon cursor="pointer" onClick={() => modifyRecipient(recipient.accountNumber)} />
									<SendIcon cursor="pointer" onClick={() => router.push(`/transfer/${accountType}?id=${recipient.accountNumber}`)} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog
				open={deletingIban !== ''}
				onClose={() => setDeletingIban('')}
				aria-labelledby="draggable-dialog-title"
			>
				<DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
					Delete recipient
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete recipient with iban '{deletingIban}'
					</DialogContentText>
				</DialogContent>
				<DialogContent>
					<DialogContentText>
						<CodeGen onChange={v => setCode(v)} model={code} />
					</DialogContentText>
				</DialogContent>
				<DialogContent>
					<DialogContentText>
						{error}
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button autoFocus onClick={() => setDeletingIban('')} color="primary">
						Cancel
					</Button>
					<Button disabled={code === ''} onClick={() => deleteRecipient(deletingIban)} color="primary">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
});

export default RecipientsList;