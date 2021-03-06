import {getAccessToken, getSession, withApiAuthRequired} from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function products(req, res) {
  // If your Access Token is expired and you have a Refresh Token
  // // `getAccessToken` will fetch you a new one using the `refresh_token` grant
  const { accessToken } = await getAccessToken(req, res, {
    scopes: ['openid', 'profile', 'email']
  });
  const session = getSession(req, res);
  console.log(session?.accessToken);
  console.log(session?.idToken);
  console.log(session?.user);
  res.status(200).json(accessToken);
});