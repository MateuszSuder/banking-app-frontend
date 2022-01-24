import type {NextPage} from 'next'
import {observer} from "mobx-react";
import {useStore} from "../../store/MainStore";
import React, {useEffect, useState} from "react";
import {
	Button, Checkbox,
	Divider, FormControlLabel,
	Grid,
	Input,
	InputAdornment,
	InputLabel,
	Slider,
	TextField,
	Typography
} from "@material-ui/core";
import CodeGen from "../../components/Forms/CodeGen";

type Mark = {
	value: number;
	label: string;
}

type Marks = {
	amount: Mark[];
	length: Mark[];
}
export const Loan: NextPage = observer(() => {
	const [amount, setAmount] = useState<number>(1000);
	const [length, setLength] = useState(3);
	const [autoPayment, setAutoPayment] = useState(false);
	const [marks, setMarks] = useState<Marks>({ amount: [], length: [] });
	const [min, setMin] = useState<{ amount: number, length: number }>({amount: 1000, length: 3})
	const [max, setMax] = useState<{ amount: number, length: number }>({amount: 1000, length: 3})
	const [rate, setRate] = useState<number>(0);
	const [pay, setPay] = useState<number>(0);
	const [code, setCode] = useState<string>("");
	const store = useStore();

	const handleAmount = (event: any, newValue: any) => {
		setAmount(newValue);
	};

	const handleLength = (event: any, newValue: any) => {
		setLength(newValue);
	};

	const switchAutoPayment = (auto: boolean) => {
		fetch('/api/loan/switch', {
			method: "POST",
			body: JSON.stringify({
				autoPayment: auto,
				code
			})
		})
			.then(d => {
				if(d.ok) return d.text()
				throw d.json()
			})
			.then(d => {
				location.reload();
			})
			.catch(async e => {
				const mess = await e;
				console.error(mess.message_details || mess.error);
				store.util.modal = mess.message_details || mess.error;
			})
	}

	const payAmount = () => {
		fetch('/api/loan/pay', {
			method: "POST",
			body: JSON.stringify({
				amount: pay,
				code
			})
		})
			.then(d => {
				if(d.ok) return d.json()
				throw d.json()
			})
			.then(d => {
				location.reload();
			})
			.catch(async e => {
				const mess = await e;
				console.error(mess.message_details || mess.error);
				store.util.modal = mess.message_details || mess.error;
			})
	}

	const takeLoan = () => {
		fetch('/api/loan/take', {
			method: "POST",
			body: JSON.stringify({
				loanAmount: amount,
				loanLength: length,
				loanRate: rate,
				autoPayment,
				code
			})
		})
			.then(d => {
				if(d.ok) return d.json()
				throw d.json()
			})
			.then(d => {
				location.replace('/api/auth/login')
			})
			.catch(async e => {
				const mess = await e;
				console.error(mess.message_details || mess.error);
				store.util.modal = mess.message_details || mess.error;
			})
	}

	useEffect(() => {
		fetch('/api/loan/config')
			.then(r => {
				if(r.ok) return r.json()
				throw r.json();
			})
			.then(d => {
				console.log(d)
				setMarks(prevState => ({...prevState, amount: [
						{
							value: d.minLoanValue, label: d.minLoanValue.toString()
						},
						{
							value: d.maxLoanValue, label: d.maxLoanValue.toString()
						}
					],
					length: [
						{
							value: d.minLoanLengthInMonths, label: d.minLoanLengthInMonths.toString()
						},
						{
							value: d.maxLoanLengthInMonths, label: d.maxLoanLengthInMonths.toString()
						}
					]
				}))

				setMin(prevState => ({ ...prevState, amount: d.minLoanValue, length: d.minLoanLengthInMonths }));
				setMax(prevState => ({ ...prevState, amount: d.maxLoanValue, length: d.maxLoanLengthInMonths }));
				setRate(d.loanRate);
			})
			.catch(async e => {
				console.error(await e);
			})
	}, [])

	const newLoan =
			<form>
				<Typography variant="h4" align="center" gutterBottom>Take loan</Typography>
				<Divider style={{marginBottom: "2rem"}}/>
				<Typography id="loan-slider" gutterBottom>
					Loan value
				</Typography>
				<Slider
					value={amount}
					onChange={handleAmount}
					aria-labelledby="loan-slider"
					valueLabelDisplay="auto"
					min={min.amount}
					max={max.amount}
					marks={marks.amount}
				/>

				<Typography id="length-slider" gutterBottom>
					Loan length in months
				</Typography>
				<Slider
					value={length}
					onChange={handleLength}
					aria-labelledby="length-slider"
					valueLabelDisplay="auto"
					min={min.length}
					max={max.length}
					marks={marks.length}
				/>
				<Divider style={{marginBottom: "2rem", marginTop: "2rem"}}/>
				<Grid container spacing={2}>
					<Grid item xs={5}>
						<InputLabel htmlFor="amount">Amount</InputLabel>
						<Input
							id="amount"
							value={amount}
							onChange={e => setAmount(parseInt(e.target.value))}
							startAdornment={<InputAdornment position="start">PLN</InputAdornment>}
							type="number"
						/>
					</Grid>
					<Grid item xs={5}>
						<InputLabel htmlFor="length">Loan length in months</InputLabel>
						<Input
							id="length"
							value={length}
							onChange={e => setLength(parseInt(e.target.value))}
							type="number"
						/>
					</Grid>
					<FormControlLabel
						control={<Checkbox
							checked={autoPayment}
							onChange={e => setAutoPayment(e.target.checked)}
							inputProps={{'aria-label': 'primary checkbox'}}
						/>}
						label="Auto payment"
					/>

					<Grid item xs={12}>
						<Typography variant="h5" align="center">
							Loan rate: {rate}
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6" align="center">Loan cost: {(amount + amount * rate / 100).toFixed(2)}</Typography>
					</Grid>
					<Grid container justifyContent="center">
						<Grid item>
							<CodeGen onChange={v => setCode(v)} model={code}/>
						</Grid>
					</Grid>
					<Grid container justifyContent="center" alignItems="center">
						<Button disabled={code === ""} variant="contained" color="primary" onClick={takeLoan}>Take loan</Button>
					</Grid>
				</Grid>
			</form>

	const loanInfo = <>
		<Grid container spacing={3}>
			<Grid item xs={6}>
				<Typography variant="body1">Started at: {store.user.getLastLoan?.startedAt}</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography variant="body1">Ends at: {store.user.getLastLoan?.endsAt}</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography variant="body1">Lent amount: {store.user.getLastLoan?.lentAmount}</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography variant="body1">Total to pay: {store.user.getLastLoan?.totalToPay}</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography variant="body1">Interest to pay: {store.user.getLastLoan?.interest}</Typography>
			</Grid>
			<Grid item xs={6}>
				<Typography variant="body1">Auto-Payment: {store.user.getLastLoan?.autoPayment ? "On" : "Off"}</Typography>
			</Grid>
		</Grid>
		{
			store.user.getLastLoan?.installments.map((installment, i) =>
				<Grid container spacing={2} key={i}>
					<Grid item xs={4}>
						<Typography variant="body1" align="center">
							Installment #{installment.id}
						</Typography>
					</Grid>
					<Grid item xs={4}>
						<Typography variant="body1" align="center">
							Amount left to pay: {installment.amountLeftToPay.toFixed(2)}
						</Typography>
					</Grid>
					<Grid item xs={4}>
						<Typography variant="body1" align="center">
							Payment day: {new Date(installment.paymentDay).getDate() + "-" + (new Date(installment.paymentDay).getMonth() + 1) + "-" + new Date(installment.paymentDay).getFullYear() || '-'}
						</Typography>
					</Grid>
				</Grid>
			)
		}
		<Divider style={{marginTop: "2rem", marginBottom: "2rem"}} />
		<Grid container spacing={2}>
			<Grid item xs={4}>
				<CodeGen onChange={v => setCode(v)} model={code} />
			</Grid>

			<Grid item xs={12}>
				<div>
					<InputLabel htmlFor="pay">Pay:</InputLabel>
					<Input
						id="pay"
						value={pay}
						onChange={e => setPay(parseInt(e.target.value))}
						startAdornment={<InputAdornment position="start">PLN</InputAdornment>}
						type="number"
					/>
				</div>
				<Button variant="contained" color="primary" onClick={() => payAmount()}>Pay</Button>
				<Button variant="contained" color="primary" onClick={() => switchAutoPayment(!store.user.getLastLoan?.autoPayment)}>Switch Auto-Payment {store.user.getLastLoan?.autoPayment ? "Off" : "On"}</Button>
			</Grid>
		</Grid>
	</>
	return (
		<>
			{
				store.user.hasActiveLoan ?
					loanInfo : newLoan
			}
		</>
	)
});

export default Loan;