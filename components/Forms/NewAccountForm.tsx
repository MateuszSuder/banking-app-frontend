import type {NextPage} from 'next'
import {observer} from "mobx-react";
import CodeGen from "./CodeGen";
import {useState} from "react";

type Props = {
	onSuccess: () => void;
}
export const NewAccountForm: (props: Props) => JSX.Element = observer((props: Props) => {
	const [code, setCode] = useState('');
	const [text, setText] = useState('');

	const submit = async () => {
		setText('');
		fetch('/api/account/open/standard', {
			method: 'POST',
			body: JSON.stringify({
				code
			})
		})
			.then(response => {
				if(response.ok)
					response.json()
				else throw response.json()
			})
			.then(d => props.onSuccess())
			.catch(async e => {
			setText((await (e)).message_details)
		})
	}

	return (
		<div>
			<p>Open your first account!</p>
			<CodeGen model={code} onChange={(val) => setCode(val)} />
			<p style={{color: "red"}}>{text}</p>
			<div className="center">
			<button onClick={submit}>Create account</button>
			</div>
		</div>
	);
});

export default NewAccountForm;