import type {NextPage} from 'next'
import {observer} from "mobx-react";
import {Transaction} from "../../requests/TransactionRequest";
import {makeStyles} from "@material-ui/core";
import {useState} from "react";

const useStyles = makeStyles((theme) => ({
	row: {
		display: "grid",
		gridTemplateColumns: "1fr 1fr 1fr",
		borderBottom: "solid 1px",
		borderBottomColor: theme.palette.grey.A100,
		paddingBottom: theme.spacing(1),
		transition: "0.5s",
		borderRadius: "0.25rem",
		cursor: "pointer",
		"&:hover": {
			background: theme.palette.grey.A100
		}
	}
}));

type Props = {
	iban: string,
	transaction: Transaction;
};
export const HistoryRow: (props: Props) => JSX.Element = observer((props: Props) => {
	const classes = useStyles();
	const [expand, setExpand] = useState(false);

	return (
		<>
			<div className={classes.row} onClick={() => setExpand(!expand)}>
				<div>
					{props.transaction.from === props.iban ? "-" : "+"}
					{props.transaction.sendValue.amount + props.transaction.sendValue.currency}
				</div>
				<div>
					{props.transaction.title}
				</div>
				<div>
					{props.transaction.transactionType}
				</div>
			</div>
			{expand && <div>
	      <div>From: {props.transaction.from}</div>
				{props.transaction.from === props.iban && <div>Title: {props.transaction.title}</div>}
	      <div>Receiver iban: {props.transaction.receiverInfo.accountNumber}</div>
	      <div>Receiver name: {props.transaction.receiverInfo.recipientName}</div>
	      <div>Value: {props.transaction.sendValue.amount}{props.transaction.sendValue.currency}</div>
		  </div>}
		</>
	);
});

export default HistoryRow;