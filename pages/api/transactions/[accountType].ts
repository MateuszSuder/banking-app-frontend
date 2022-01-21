import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import TransactionRequest from "../../../requests/TransactionRequest";
import {ACCOUNT_TYPE} from "../../../requests/SimpleRequest";

export default withApiAuthRequired(async function products(req, res) {
	const { accessToken } = await getAccessToken(req, res, {
		scopes: ['openid', 'profile', 'email']
	});
	const { accountType } = req.query;
	const { code, ...rest } = JSON.parse(req.body);
	try {
		const tra = new TransactionRequest(accessToken, code);
		const result = await tra.getTransactionPage(accountType as ACCOUNT_TYPE, rest);
		return res.status(200).json(result);
	} catch(e: any) {
		console.log(e);
		const parsed = JSON.parse(e.message);
		return res.status(parsed.code || parsed.status).json(parsed);
	}
});