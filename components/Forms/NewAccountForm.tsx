import type {NextPage} from 'next'
import {observer} from "mobx-react";
import CodeGen from "./CodeGen";
import {useState} from "react";

type Props = {
	onSuccess: () => void;
	type: 'standard' | 'multi'
}
export const NewAccountForm: (props: Props) => JSX.Element = observer((props: Props) => {
	const [code, setCode] = useState('');
	const [text, setText] = useState('');

	const submit = async () => {
		setText('');
		fetch('/api/account/open/' + props.type, {
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
			{ props.type === 'standard' ?
				<p>Open your first account!</p> :
				<p>Open Multi-Currency account</p>
			}
			<CodeGen model={code} onChange={(val) => setCode(val)} />
			<p style={{color: "red"}}>{text}</p>
			<div className="center">
			<button onClick={submit}>Create account</button>
			</div>
		</div>
	);
});

export default NewAccountForm;