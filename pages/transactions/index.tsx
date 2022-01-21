import type {NextPage} from 'next'
import {observer} from "mobx-react";
import {DataGrid} from '@material-ui/data-grid';
import {Button, Divider, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {IOFilter, SortType, Transaction, TransactionType} from "../../requests/TransactionRequest";
import {useStore} from "../../store/MainStore";

type Row = {
	id: number,
	from: string,
	toIban: string,
	toName: string,
	value: string,
	transactionType: string
}

interface RowsState {
	page: number;
	pageSize: number;
	rows: Row[];
	loading: boolean;
	count: number;
}

interface Filters {
	ioFilter: IOFilter;
	startDate?: string;
	endDate?: string;
	recipientName?: string;
	recipientIban?: string;
	amountFrom?: number;
	amountTo?: number;
	currency?: string;
	title?: string;
	sortType?: SortType;
	transactionType?: TransactionType[];
}

const columns = [
	{
		field: 'from',
		headerName: 'From',
		width: 270,
		sortable: false
	},
	{
		field: 'toIban',
		headerName: 'Recipient Iban',
		width: 270,
		sortable: false
	},
	{
		field: 'toName',
		headerName: 'Recipient name',
		width: 160,
		sortable: false
	},
	{
		field: 'value',
		headerName: 'Send value',
		width: 160,
		sortable: false
	},
	{
		field: 'transactionType',
		headerName: 'Type',
		sortable: false,
		width: 160
	},
];


export const Transactions: NextPage = observer(() => {
	const [rowsState, setRowsState] = useState<RowsState>({
		page: 0,
		pageSize: 5,
		rows: [],
		loading: false,
		count: 0
	});

	const [filters, setFilters] = useState<Filters>({ioFilter: IOFilter.ANY, sortType: SortType.DATE_DESC});
	const [accountType, setAccountType] = useState<'standard' | 'multi'>('standard');

	const store = useStore();

	const filter = async () => {
		setRowsState({
			page: 0,
			pageSize: 5,
			rows: [],
			loading: true,
			count: 0
		})
		await search();
	}

	const search = async () => {
		setRowsState((prev) => ({...prev, loading: true}))
		fetch(`/api/transactions/${accountType}`, {
			method: "POST",
			body: JSON.stringify({
				pagination: {
					offset: rowsState.page * 10,
					limit: 10
				},
				...filters,
				startDate: filters.startDate === "" ? undefined : filters.startDate,
				endDate: filters.endDate === "" ? undefined : filters.endDate,
				recipientName: filters.recipientName === "" ? undefined : filters.recipientName,
				recipientIban: filters.recipientIban === "" ? undefined : filters.recipientIban,
				amountFrom: filters.amountFrom === 0 ? undefined : filters.amountFrom,
				amountTo: filters.amountTo === 0 ? undefined : filters.amountTo,
				currency: filters.currency === "" ? undefined : filters.currency,
				title: filters.title === "" ? undefined : filters.title,
			})
		})
			.then(r => {
				if (r.ok) return r.json();
				throw r.json();
			})
			.then(d => {
				const res: Row[] = d.transactions.map((t: Transaction, i: number) => ({id: i, from: t.from, toIban: t.receiverInfo.accountNumber, toName: t.receiverInfo.recipientName, value: `${t.sendValue.amount}${t.sendValue.currency}`, transactionType: t.transactionType}))
				setRowsState((prev) => ({ ...prev, loading: false, rows: res, count: d.paginationOutput.count}))
			})
			.catch(async e => {
				const mess = await e;
				store.util.modal = mess.message_details;
			});
	}

	useEffect(() => {
		(async () => await search())();
	}, [rowsState.page])

	return (
		<>
			<Typography variant="h6" align="center" gutterBottom>Transactions</Typography>
			<Divider style={{marginBottom: "2rem"}} />
			<form noValidate className="filter-form">
				<div>
					<InputLabel id="ioFilter">Incoming/Outgoing</InputLabel>
					<Select
						labelId="ioFilter"
						id="ioFilter-input"
						value={filters.ioFilter}
						onChange={e => setFilters((prev) => ({ ...prev, ioFilter: e.target.value as IOFilter }))}
					>
						<MenuItem value={IOFilter.ANY}>{IOFilter.ANY}</MenuItem>
						<MenuItem value={IOFilter.INCOMING}>{IOFilter.INCOMING}</MenuItem>
						<MenuItem value={IOFilter.OUTGOING}>{IOFilter.OUTGOING}</MenuItem>
					</Select>
				</div>
				<div>
					<InputLabel id="account-type">Account type</InputLabel>
					<Select
						labelId="account-type"
						id="account-type-input"
						value={accountType}
						onChange={e => setAccountType(e.target.value as 'standard' | 'multi')}
					>
						<MenuItem value="standard">Standard</MenuItem>
						<MenuItem value="multi">Multi-Currency</MenuItem>
					</Select>
				</div>
				<div>
					<InputLabel id="sort-type">Sorting</InputLabel>
					<Select
						labelId="sort-type"
						id="sort-type-input"
						value={filters.sortType}
						onChange={e => setFilters(prevState => ({ ...prevState, sortType: e.target.value as SortType }))}
					>
						<MenuItem value={undefined} />
						<MenuItem value="DATE_ASC">Date ascending</MenuItem>
						<MenuItem value="DATE_DESC">Date descending</MenuItem>
						<MenuItem value="VALUE_ASC">Value ascending</MenuItem>
						<MenuItem value="VALUE_DESC">Value descending</MenuItem>
					</Select>
				</div>
				<div>
					<InputLabel id="currency">Currency</InputLabel>
					<Select
						labelId="currency"
						id="currency-input"
						value={filters.currency}
						onChange={e => setFilters(prevState => ({ ...prevState, currency: e.target.value as string }))}
					>
						<MenuItem value={undefined} />
						<MenuItem value="PLN">PLN</MenuItem>
						<MenuItem value="USD">USD</MenuItem>
						<MenuItem value="CHF">CHF</MenuItem>
						<MenuItem value="EUR">EUR</MenuItem>
						<MenuItem value="JPY">JPY</MenuItem>
						<MenuItem value="GBP">GBP</MenuItem>
					</Select>
				</div>
				<div style={{gridColumn: "span 2"}}>
					<InputLabel id="transaction-type">Transaction type</InputLabel>
					<Select
						labelId="transaction-type"
						id="transaction-type-input"
						value={filters.transactionType}
						onChange={e => setFilters(prevState => ({ ...prevState, transactionType: e.target.value === undefined ? undefined : [e.target.value as TransactionType]}))}
					>
						<MenuItem value={undefined} />
						<MenuItem value="MANUAL">Manual</MenuItem>
						<MenuItem value="STANDING_ORDER">Standing order</MenuItem>
						<MenuItem value="LOAN_PAYMENT">Loan payment</MenuItem>
					</Select>
				</div>
				<div style={{gridColumn: "span 2"}}>
					<TextField
						id="fromDate"
						label="Start date"
						type="date"
						InputLabelProps={{
							shrink: true,
						}}
						value={filters.startDate}
						onChange={e => setFilters(prevState => ({...prevState, startDate: e.target.value}))}
					/>
					<TextField
						id="endDate"
						label="End date"
						type="date"
						InputLabelProps={{
							shrink: true,
						}}
						value={filters.endDate}
						onChange={e => setFilters(prevState => ({...prevState, endDate: e.target.value}))}
					/>
				</div>
				<div style={{gridColumn: "span 2"}}>
					<TextField
						id="recipientName"
						label="Recipient name"
						type="text"
						value={filters.recipientName}
						onChange={e => setFilters(prevState => ({...prevState, recipientName: e.target.value}))}
					/>
					<TextField
						id="recipientIban"
						label="Recipient IBAN"
						type="text"
						value={filters.recipientIban}
						onChange={e => setFilters(prevState => ({...prevState, recipientIban: e.target.value}))}
					/>
				</div>
				<div style={{gridColumn: "span 2"}}>
					<TextField
						id="amountFrom"
						label="Starting amount"
						type="number"
						value={filters.amountFrom}
						onChange={e => setFilters(prevState => ({...prevState, amountFrom: parseInt(e.target.value)}))}
					/>
					<TextField
						id="amountFrom"
						label="Max amount"
						type="number"
						value={filters.amountTo}
						onChange={e => setFilters(prevState => ({...prevState, amountTo: parseInt(e.target.value)}))}
					/>
				</div>
				<div>
					<TextField
						id="title"
						label="Title"
						type="text"
						value={filters.title}
						onChange={e => setFilters(prevState => ({...prevState, title: e.target.value}))}
					/>
				</div>
				<Button variant="contained" color="primary" style={{width: "50%", justifySelf: "flex-end"}} onClick={() => filter()}> Search </Button>
			</form>
			<Divider style={{marginBottom: "2rem", marginTop: "2rem"}} />
			<div style={{ width: '100%' }}>
				<DataGrid
					rows={rowsState.rows}
					columns={columns}
					pageSize={10}
					rowCount={rowsState.count}
					disableSelectionOnClick
					autoHeight
					disableColumnMenu
					disableColumnFilter
					paginationMode="server"
					onPageChange={(page) => setRowsState((prev) => ({ ...prev, page }))}
					loading={rowsState.loading}
				/>
			</div>
		</>
	);
});

export default Transactions;