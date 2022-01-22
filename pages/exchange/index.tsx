import type {NextPage} from 'next'
import {observer} from "mobx-react";
import {useStore} from "../../store/MainStore";
import {
	Button,
	Divider,
	Grid,
	Input,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Typography
} from "@material-ui/core";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import React, {useEffect, useState} from "react";
import {RateInfo} from "../../requests/RateRequest";
import CodeGen from "../../components/Forms/CodeGen";

type Props = {
	
};
export const Exchange: NextPage = observer((props: Props) => {
	const [inputCurrency, setInputCurrency] = useState<string>("");
	const [outputCurrency, setOutputCurrency] = useState<string>("");
	const [inputAmount, setInputAmount] = useState<string>("");
	const [code, setCode] = useState<string>("");
	const [calculated, setCalculated] = useState("");

	const [rates, setRates] = useState<RateInfo[]>([]);

	const store = useStore();

	const calcExchange = () => {
		if(inputCurrency === "" || inputAmount === "" || outputCurrency === "") {
			store.util.modal = "Fill all data"
			return;
		}
		if(rates) {
			const def = rates.find(el => el.defaultCurrency === inputCurrency);

			if(def) {
				const rate = def.rates.find(el => el.currency === outputCurrency);
				if(rate) {
					setCalculated((parseInt(inputAmount) / rate.price).toFixed(2));
				}

			}
		}
	}

	const exchange = () => {
		fetch('/api/exchange/exchange', {
			method: "POST",
			body: JSON.stringify({
				from: {
					currency: inputCurrency,
					amount: inputAmount
				},
				to: outputCurrency,
				code
			})
		})
			.then(d => {
				if(d.ok) return d.json()
				throw d.json()
			})
			.then(d => {
				console.log(d);
				location.reload()
			})
			.catch(async e => {
				const mess = await e;
				console.error(mess.message_details || mess.error);
				store.util.modal = mess.message_details || mess.error;
			})
	}

	useEffect(() => {
		fetch('/api/exchange/info')
			.then(d => {
				if(d.ok) return d.json()
				throw d.json()
			})
			.then(d => {
				setRates(d.filter((el: RateInfo) => el.type === 'fiat'));
			})
			.catch(async e => {
				const mess = await e;
				console.error(mess.message_details || mess.error);
				store.util.modal = mess.message_details || mess.error;
			})
	}, [])

	return (
		<>
			<Grid container>
				<Grid item xs={5}>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<InputLabel id="input-currency">Input currency</InputLabel>
							<Select
								labelId="input-currency"
								id="input-currency-select"
								value={inputCurrency}
								onChange={e => setInputCurrency(e.target.value as string)}
								fullWidth
							>
								{
									rates.map((rate, i) =>
										<MenuItem value={rate.defaultCurrency} key={i}>{rate.defaultCurrency}</MenuItem>
									)
								}
							</Select>
						</Grid>
						<Grid item xs={6}>
							<InputLabel htmlFor="input-amount">Input amount</InputLabel>
							<Input
								id="input-amount"
								value={inputAmount}
								onChange={e => setInputAmount(e.target.value)}
								type="number"
							/>
						</Grid>

					</Grid>
				</Grid>
				<Grid item xs={2} style={{display: "flex", justifyContent: "center"}} >
					<ArrowForwardIosIcon/>
				</Grid>
				<Grid item xs={5}>
					<Grid container spacing={2}>
						<Grid item xs={6}>
							<InputLabel id="output-currency">Output currency</InputLabel>
							<Select
								labelId="output-currency"
								id="output-currency-select"
								value={outputCurrency}
								onChange={e => setOutputCurrency(e.target.value as string)}
								fullWidth
							>
								{
									rates.map((rate, i) =>
										<MenuItem value={rate.defaultCurrency} key={i}>{rate.defaultCurrency}</MenuItem>
									)
								}
							</Select>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12}>
					<Divider style={{marginTop: "2rem", marginBottom: "2rem"}} />
					<Grid container justifyContent="center" spacing={2}>
						<Button variant="contained" color="primary" onClick={calcExchange}>Calculate</Button>
						<Grid item xs={12}>
							<Typography align="center">
								{ calculated !== "" && <div>{inputAmount} {inputCurrency} {'>'} {calculated}{outputCurrency}</div>}
							</Typography>
						</Grid>
					</Grid>
					<Divider style={{marginTop: "2rem", marginBottom: "2rem"}} />
					<Grid container justifyContent="center">
						<CodeGen onChange={v => setCode(v)} model={code} />
						<Grid container justifyContent="center" style={{marginTop: "2rem"}}>
							<Button variant="contained" color="primary" onClick={exchange}>Exchange</Button>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
});

export default Exchange;