import type {NextPage} from 'next'
import {useStore} from "../store/MainStore";
import {observer} from "mobx-react";
import {useEffect} from "react";

const Dashboard: NextPage = observer(() => {
	const store = useStore();

	useEffect(() => {
		fetch('api/account/info/standard')
			.then(res => res.json())
			.then(data => console.log(data))
	}, [])
	return (
		<div>
			test
		</div>
	);
});

export default Dashboard;