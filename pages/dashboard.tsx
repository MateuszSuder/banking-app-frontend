import type {NextPage} from 'next'
import {useStore} from "../store/MainStore";
import {observer} from "mobx-react";
import {useEffect, useState} from "react";
import SimpleModal from "../components/Modal/SimpleModal";
import NewAccountForm from "../components/Forms/NewAccountForm";
import AccountCard from "../components/Account/AccountCard";
import {makeStyles, Typography} from "@material-ui/core";
import {Transaction} from "../requests/TransactionRequest";
import ShortHistory from "../components/Account/ShortHistory";

const useStyles = makeStyles((theme) => ({
	main: {
		width: theme.breakpoints.values.lg,
		margin: "auto",
		paddingTop: theme.spacing(5)
	},
	cardsContainer: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr",
		gap: "1rem",
		marginBottom: theme.spacing(5)
	}
}));


const Dashboard: NextPage = observer(() => {
	const [history, setHistory] = useState<Transaction[]>([]);
	const [multiHistory, setMultiHistory] = useState<Transaction[]>([]);

	const store = useStore();

	const classes = useStyles();

	useEffect(() => {
		if(store.user.userAccounts) {
			for(const acc of store.user.userAccounts) {
				fetch('/api/account/transactions/' + (acc.id[11] == "1" ? 'standard' : 'multi'), {
					method: 'POST',
					body: JSON.stringify({
						pagination: {
							offset: 0,
							limit: 10
						},
						sortType: "DATE_DESC",
						ioFilter: "ANY",
					})
				}).then(res => res.json())
					.then(data => {
						acc.id[11] == "1" ? setHistory(data.transactions) : setMultiHistory(data.transactions);
					})
					.catch(err => console.error(err))
			}

		}
	}, [store.user.userAccounts])

	const onCreated = () => {
		location.replace('/api/auth/login');
	}

	return (
		<div>
			{
				store.util.noAccountModal ? <SimpleModal closable={false} open={true} body={<NewAccountForm type='standard' onSuccess={() => onCreated()} />} /> :
					<div>
						{
							store.user.userAccounts && store.user.userAccounts.map(acc =>
								<div className={classes.cardsContainer} key={acc.id}>
									<div>
										<AccountCard acc={acc} />
									</div>
									<div>
										<Typography variant={'h6'}>
											History
										</Typography>
										<ShortHistory transactions={acc.id[11] == "1" ? history : multiHistory} iban={acc.id} />
									</div>

								</div>
							)
						}
					</div>
			}
		</div>
	);
});

export default Dashboard;