import type {NextPage} from 'next'
import {useStore} from "../store/MainStore";
import {observer} from "mobx-react";

type Props = {
	
};
export const Test3: NextPage = observer((props: Props) => {
	const store = useStore();
	return (
		<div>

		</div>
	);
});