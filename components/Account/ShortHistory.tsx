import {observer} from "mobx-react";
import {Transaction} from "../../requests/TransactionRequest";
import {makeStyles} from "@material-ui/core";
import {useState} from "react";
import HistoryRow from "./HistoryRow";

type Props = {
	iban: string;
	transactions: Transaction[]
};
export const ShortHistory: (props: Props) => JSX.Element = observer((props: Props) => {
	return (
		<div>
			{
				props.transactions.map((t, id) =>
					<HistoryRow iban={props.iban} transaction={t} key={id} />
				)
			}
		</div>
	);
});

export default ShortHistory;