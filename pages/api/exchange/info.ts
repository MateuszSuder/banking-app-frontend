import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import RateRequest from "../../../requests/RateRequest";

export default withApiAuthRequired(async function products(req, res) {
	const { accessToken } = await getAccessToken(req, res, {
		scopes: ['openid', 'profile', 'email']
	});
	try {
		const rate = new RateRequest(accessToken);
		const result = await rate.ratesInfo();
		return res.status(200).json(result);
	} catch(e: any) {
		console.log(e);
		const parsed = JSON.parse(e.message);
		return res.status(parsed.code || parsed.status).json(parsed);
	}
});