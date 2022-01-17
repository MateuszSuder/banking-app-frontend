import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import AccountRequest from "../../../../requests/AccountRequest";
import {ACCOUNT_TYPE} from "../../../../requests/SimpleRequest";

export default withApiAuthRequired(async function products(req, res) {
	const { accessToken } = await getAccessToken(req, res, {
		scopes: ['openid', 'profile', 'email']
	});
	const { accountType } = req.query;
	const acc = new AccountRequest(accessToken);
	const result = await acc.accountInfo(accountType as ACCOUNT_TYPE);

	res.status(200).json(result);
});