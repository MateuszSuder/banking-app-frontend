import type {NextPage} from 'next'
import {observer} from "mobx-react";
import {Button, Card, CardActions, CardContent, makeStyles, Typography} from "@material-ui/core";
import {AccountInfo} from "../../requests/AccountRequest";

const useStyles = makeStyles((theme) => ({
	root: {
		minWidth: 275,
	},
	balance: {
		lineHeight: "1em",
		marginBottom: 0,
		marginTop: theme.spacing(5)
	},
	transfer: {
		marginTop: theme.spacing(2)
	}
}));

type Props = {
	acc: AccountInfo
};
export const AccountCard: (props: Props) => JSX.Element = observer((props: Props) => {
	const classes = useStyles();

	return (
		<Card className={classes.root} variant="outlined">
			<CardContent>
				<Typography variant='h6' color="textPrimary" gutterBottom>
					{props.acc.id[11] == "1" ? 'Standard' : 'Multi-Currency'}
				</Typography>
				<Typography variant='subtitle1' color="textSecondary" gutterBottom>
					{props.acc.id}
				</Typography>
				{
					props.acc.currencies.map((curr, i) =>
						<div key={i}>
							<Typography variant='subtitle1' color="textSecondary" className={classes.balance} gutterBottom>
								Balance ({curr.currency})
							</Typography>
							<Typography variant="h4">
								{curr.amount.toFixed(2) + " " + curr.currency}
							</Typography>
						</div>
					)
				}
				<Button variant="contained" color="primary" className={classes.transfer} >
					New transfer
				</Button>
			</CardContent>
		</Card>
	);
});

export default AccountCard;