import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import RecipientRequest from "../../../../requests/RecipientRequest";
import {ACCOUNT_TYPE} from "../../../../requests/SimpleRequest";
import StandingRequest from "../../../../requests/StandingRequest";

export default withApiAuthRequired(async function products(req, res) {
	const { accessToken } = await getAccessToken(req, res, {
		scopes: ['openid', 'profile', 'email']
	});
	const { accountType } = req.query;
	const { code, id, ...rest } = JSON.parse(req.body);
	try {
		const sta = new StandingRequest(accessToken, code);
		const result = await sta.modifyStandingOrder(accountType as ACCOUNT_TYPE, id, rest);
		return res.status(200).json(result);
	} catch(e: any) {
		console.log(e);
		const parsed = JSON.parse(e.message);
		return res.status(parsed.code || parsed.status).json(parsed);
	}
});