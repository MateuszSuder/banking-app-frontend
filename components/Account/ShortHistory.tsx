import type {NextPage} from 'next'
import {observer} from "mobx-react";
import {Transaction} from "../../requests/TransactionRequest";
import {makeStyles} from "@material-ui/core";
import { shadows } from '@material-ui/system';

const useStyles = makeStyles((theme) => ({
	row: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr 1fr",
		borderBottom: "solid 1px",
		borderBottomColor: theme.palette.grey.A100,
		paddingBottom: theme.spacing(1),
		transition: "0.5s",
		borderRadius: "0.25rem",
		"&:hover": {
			background: theme.palette.grey.A100
		}
	}
}));

type Props = {
	iban: string;
	transactions: Transaction[]
};
export const ShortHistory: (props: Props) => JSX.Element = observer((props: Props) => {
	const classes = useStyles();
	return (
		<div>
			{
				props.transactions.map((t, id) =>
					<div className={classes.row} id={`${props.iban}${id}`}>
						<div>
							{t.from === props.iban ? "-" : "+"}
							{t.sendValue.amount + t.sendValue.currency}
						</div>
						<div>
							{t.title}
						</div>
						<div>
							{t.transactionType}
						</div>
					</div>
				)
			}
		</div>
	);
});

export default ShortHistory;