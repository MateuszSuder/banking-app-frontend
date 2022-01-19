import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import AccountRequest from "../../../../requests/AccountRequest";
import {ACCOUNT_TYPE} from "../../../../requests/SimpleRequest";
import TransactionRequest from "../../../../requests/TransactionRequest";

export default withApiAuthRequired(async function products(req, res) {
	const { accessToken } = await getAccessToken(req, res, {
		scopes: ['openid', 'profile', 'email']
	});
	const { accountType } = req.query;
	try {
		const tr = new TransactionRequest(accessToken);
		const result = await tr.getTransactionPage(accountType as ACCOUNT_TYPE, JSON.parse(req.body));
		return res.status(200).json(result);
	} catch(e: any) {
		const parsed = JSON.parse(e.message);
		return res.status(parsed.code || parsed.status).json(parsed);
	}
});