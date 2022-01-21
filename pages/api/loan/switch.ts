import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import LoanRequest from "../../../requests/LoanRequest";

export default withApiAuthRequired(async function products(req, res) {
	const { accessToken } = await getAccessToken(req, res, {
		scopes: ['openid', 'profile', 'email']
	});
	const { code, autoPayment } = JSON.parse(req.body);

	try {
		const loan = new LoanRequest(accessToken, code);
		const result = await loan.setAuto(autoPayment);
		return res.status(200).json(result);
	} catch(e: any) {
		console.log(e);
		const parsed = JSON.parse(e.message);
		return res.status(parsed.code || parsed.status).json(parsed);
	}
});