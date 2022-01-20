import type {NextPage} from 'next'
import {observer} from "mobx-react";
import {Button, makeStyles, TextField} from "@material-ui/core";
import React, {useState} from "react";

const useStyles = makeStyles((theme) => ({
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
			<div className="code-container">
				<TextField label="code" onChange={(v) => props.onChange(v.target.value)} value={props.model} fullWidth />
				<Button variant="contained" color="primary" onClick={sendCode}>Generate code</Button>
			</div>
			<p>{text}</p>
		</>
	);
});

export default CodeGen;