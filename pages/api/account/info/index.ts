import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import AccountRequest from "../../../../requests/AccountRequest";

export default withApiAuthRequired(async function products(req, res) {
	const { accessToken } = await getAccessToken(req, res, {
		scopes: ['openid', 'profile', 'email']
	});
	const acc = new AccountRequest(accessToken);
	const result = await acc.accountsInfo();

	res.status(200).json(result);
});