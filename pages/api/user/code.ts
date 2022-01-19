import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import LoanRequest from "../../../requests/LoanRequest";

export default withApiAuthRequired(async function products(req, res) {
	const { accessToken } = await getAccessToken(req, res, {
		scopes: ['openid', 'profile', 'email']
	});

	const result = await fetch('http://localhost:8080/api/user/code', {
		method: "POST",
		headers: {
			"Authorization": `Bearer ${accessToken}`
		}
	});

	res.status(result.status).json({success: result.ok});
});