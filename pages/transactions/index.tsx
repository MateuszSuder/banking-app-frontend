import type {NextPage} from 'next'
import {observer} from "mobx-react";
import {DataGrid, GridRowModel} from '@material-ui/data-grid';
import {Divider, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {IOFilter, SortType, Transaction, TransactionType} from "../../requests/TransactionRequest";

type Row = {
	id: number,
	from: string,
	toIban: string,
	to: string,
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
	transactionType?: TransactionType;
}

const columns = [
	{
		field: 'from',
		headerName: 'From',
		width: 150,
		sortable: false
	},
	{
		field: 'toIban',
		headerName: 'Recipient Iban',
		width: 150,
		sortable: false
	},
	{
		field: 'to',
		headerName: 'Recipient name',
		width: 150,
		sortable: false
	},
	{
		field: 'value',
		headerName: 'Send value',
		width: 110,
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

	const [filters, setFilters] = useState<Filters>({ioFilter: IOFilter.ANY});
	const [accountType, setAccountType] = useState<'standard' | 'multi'>('standard');

	useEffect(() => {
		setRowsState((prev) => ({...prev, loading: true}))
		fetch(`/api/transactions/${accountType}`, {
			method: "POST",
			body: JSON.stringify({
				pagination: {
					offset: rowsState.page * 10,
					limit: 10
				},
				...filters
			})
		})
			.then(r => {
				if (r.ok) return r.json();
				throw r.json();
			})
			.then(d => {
				const res: Row[] = d.transactions.map((t: Transaction, i: number) => ({id: i, from: t.from, to: t.receiverInfo.accountNumber, value: `${t.sendValue.amount}${t.sendValue.currency}`, type: t.transactionType}))
				setRowsState((prev) => ({ ...prev, loading: false, rows: res, count: d.paginationOutput.count}))
			})
			.catch(async e => console.log(await e));
	}, [rowsState.page])

	return (
		<>
			<Typography variant="h6" align="center" gutterBottom>Transactions</Typography>
			<Divider style={{marginBottom: "2rem"}} />
			<form noValidate className="filter-form">
				<InputLabel id="demo-simple-select-label">Incoming/Outgoing</InputLabel>
				<Select
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					value={filters.ioFilter}
					onChange={e => setFilters((prev) => ({ ...prev, ioFilter: e.target.value as IOFilter }))}
				>
					<MenuItem value={IOFilter.ANY}>{IOFilter.ANY}</MenuItem>
					<MenuItem value={IOFilter.INCOMING}>{IOFilter.INCOMING}</MenuItem>
					<MenuItem value={IOFilter.OUTGOING}>{IOFilter.OUTGOING}</MenuItem>
				</Select>
				<div>
					<TextField
						id="fromDate"
						label="Start date"
						type="date"
						InputLabelProps={{
							shrink: true,
						}}
					/>
					<TextField
						id="endDate"
						label="End date"
						type="date"
						InputLabelProps={{
							shrink: true,
						}}
					/>
				</div>
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