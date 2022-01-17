import {getAccessToken, withApiAuthRequired} from "@auth0/nextjs-auth0";
import LoanRequest from "../../../requests/LoanRequest";

export default withApiAuthRequired(async function products(req, res) {
	const { accessToken } = await getAccessToken(req, res, {
		scopes: ['openid', 'profile', 'email']
	});
	const loanRequest = new LoanRequest(accessToken);
	const result = await loanRequest.payLoan({amount: 10});

	res.status(200).json(result);
});