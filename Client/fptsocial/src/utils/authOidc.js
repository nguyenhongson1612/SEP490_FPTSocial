import { AuthProvider } from 'oidc-react'

const oidcConfig = {
  onSignIn: () => {
    // Redirect?
    console.log('User signed in')
  },
  authority: 'https://feid.ptudev.net',
  clientId: 'societe-front-end',
  redirectUri: 'http://localhost:3000/home',
  postLogoutRedirectUri: 'http://localhost:3000/login',
  scope: 'openid profile offline_access',
  responseType: 'code',
}

export default oidcConfig