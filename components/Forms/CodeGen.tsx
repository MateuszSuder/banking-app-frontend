import type {NextPage} from 'next'
import {observer} from "mobx-react";
import {makeStyles} from "@material-ui/core";
import {useState} from "react";

const useStyles = makeStyles((theme) => ({
	container: {
		display: "grid",
		gridTemplateColumns: "2fr 1fr",
		gap: theme.spacing(2)
	}
}));

type Props = {
	onChange: (arg0: string) => void;
	model: string;
}
export const CodeGen: (props: Props) => JSX.Element = observer((props: Props) => {
	const [text, setText] = useState('');
	const classes = useStyles();

	const sendCode = async () => {
		await fetch('/api/user/code');
		setText('Authorization code sent to your email');
	}

	return (
		<>
			<div className={classes.container}>
				<input type="text" onChange={(v) => props.onChange(v.target.value)} value={props.model} />
				<button onClick={sendCode}>Generate code</button>
			</div>
			<p>{text}</p>
		</>
	);
});

export default CodeGen;