import type {NextPage} from 'next'
import {observer} from "mobx-react";
import {useStore} from "../../store/MainStore";
import {useEffect, useState} from "react";
import {Recipient} from "../../requests/RecipientRequest";
import {useRouter} from "next/dist/client/router";
import {Button, Divider, Grid, Typography} from "@material-ui/core";

type Props = {

};
export const RecipientsList: NextPage = observer((props: Props) => {
	const [recipients, setRecipients] = useState<Recipient[] | null>(null);
	const store = useStore();
	const router = useRouter();

	const { accountType } = router.query;

	useEffect(() => {
		if(store.user.userAccounts) {
			console.log(store.user)
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
			{ recipients?.map(el => <div>{el.recipientName}</div>)}
		</div>
	);
});

export default RecipientsList;