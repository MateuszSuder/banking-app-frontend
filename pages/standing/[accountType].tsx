import type {NextPage} from 'next'
import {observer} from "mobx-react";
import {useStore} from "../../store/MainStore";
import {
	Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
	Divider,
	Grid,
	Paper,
	Table, TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SendIcon from "@material-ui/icons/Send";
import CodeGen from "../../components/Forms/CodeGen";
import {useRouter} from "next/dist/client/router";
import {useEffect, useState} from "react";
import {StandingOrder} from "../../requests/AccountRequest";

type Props = {
	
};
export const StandingOrdersList: NextPage = observer((props: Props) => {
	const [standingOrders, setStandingOrders] = useState<StandingOrder[]>([]);
	const [deletingId, setDeletingId] = useState('');
	const [code, setCode] = useState('');
	const [error, setError] = useState('');

	const store = useStore();
	const router = useRouter();

	const { accountType } = router.query;

	const modifyStandingOrder = (id: string) => {
		router.push(`/standing/upsert/${accountType}?id=${id}`);
	}

	const deleteStandingOrder = (id: string) => {
		fetch('/api/standing/delete/' + accountType, {
			method: 'POST',
			body: JSON.stringify({
				code,
				id: deletingId
			})
		})
			.then(response => {
				if(response.ok)
					return response.json()
				else throw response.json()
			})
			.then(d => {
				setDeletingId('');
				setCode('');
				const a = store.user.getAccountWithType('standard');
				if(a) {
					a.standingOrders = d;
				}
				prepareStandingOrders();
			})
			.catch(async e => {
				setError((await (e)).message_details)
			})
	}

	const prepareStandingOrders = () => {
		if(store.user.userAccounts) {
			if(accountType === 'standard' && store.user.standard?.standingOrders) {
				setStandingOrders(store.user.standard.standingOrders)
			} else if(accountType === 'multi' && store.user.multi?.standingOrders) {
				setStandingOrders(store.user.multi.standingOrders)
			} else {
				setStandingOrders([]);
				if(!['standard', 'multi'].includes(accountType as string)) {
					router.push('/dashboard')
				}
			}
		}
	}

	useEffect(() => {
		prepareStandingOrders();
	}, [store.user.userAccounts, accountType])

	return (
		<div style={{width: "100%"}}>
			<Typography align="center" variant="h4" gutterBottom>Standing Orders</Typography>
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
					<Button variant="outlined" onClick={() => router.push('/standing/upsert/' + accountType)}>Add new standing order</Button>
				</Grid>
			</Grid>

			<Divider />
			<TableContainer component={Paper}>
				<Table aria-label="simple table">
					<TableHead>
						<TableRow>
							<TableCell width="5%">#</TableCell>
							<TableCell align="center" width="20%">Title</TableCell>
							<TableCell align="center" width="20%">Recipient name</TableCell>
							<TableCell align="center" width="20%">Next payment</TableCell>
							<TableCell align="center" width="20%">Value</TableCell>
							<TableCell align="center" width="15%"></TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{standingOrders.map((standingOrder, i) => (
							<TableRow key={standingOrder.id} style={{ background: standingOrder.lastPaymentFailed ? '#FF4633' : 'inherit'}}>
								<TableCell component="th" scope="row" width="5%">
									{i + 1}
								</TableCell>
								<TableCell align="center" width="20%">{standingOrder.title}</TableCell>
								<TableCell align="center" width="20%">{standingOrder.to.recipientName}</TableCell>
								<TableCell align="center" width="20%">{standingOrder.nextPayment}</TableCell>
								<TableCell align="center" width="20%">{standingOrder.value.amount}{standingOrder.value.currency}</TableCell>
								<TableCell align="center" width="15%">
									<DeleteIcon cursor="pointer" onClick={() => setDeletingId(standingOrder.id)} />
									<EditIcon cursor="pointer" onClick={() => modifyStandingOrder(standingOrder.id)} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Dialog
				open={deletingId !== ''}
				onClose={() => setDeletingId('')}
				aria-labelledby="draggable-dialog-title"
			>
				<DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
					Delete recipient
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to delete this standing order?
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
					<Button autoFocus onClick={() => setDeletingId('')} color="primary">
						Cancel
					</Button>
					<Button disabled={code === ''} onClick={() => deleteStandingOrder(deletingId)} color="primary">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
});

export default StandingOrdersList;