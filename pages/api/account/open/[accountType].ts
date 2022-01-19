import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import AccountRequest from "../../../../requests/AccountRequest";
import {ACCOUNT_TYPE} from "../../../../requests/SimpleRequest";

export default withApiAuthRequired(async function products(req, res) {
	const { accessToken } = await getAccessToken(req, res, {
		scopes: ['openid', 'profile', 'email']
	});
	const { accountType } = req.query;
	const { code } = JSON.parse(req.body);
	try {
		const acc = new AccountRequest(accessToken, code);
		const result = await acc.openAccount(accountType as ACCOUNT_TYPE);
		return res.status(200).json(result);
	} catch(e: any) {
		const parsed = JSON.parse(e.message);
		return res.status(parsed.code || parsed.status).json(parsed);
	}
});