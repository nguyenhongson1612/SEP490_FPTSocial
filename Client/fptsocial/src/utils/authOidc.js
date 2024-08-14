const oidcConfig = {
  onSignIn: () => {
    window.location.href = '/home'
  },
  authority: 'https://feid.ptudev.net',
  clientId: 'societe-front-end',
  // redirectUri: 'http://localhost:3000/home',
  redirectUri: 'http://14.225.210.40:3000/home',
  postLogoutRedirectUri: 'http://14.225.210.40:3000/login',
  // postLogoutRedirectUri: 'http://localhost:3000/login',
  scope: 'openid profile offline_access',
  responseType: 'code',
}
export default oidcConfig