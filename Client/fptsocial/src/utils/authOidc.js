import { checkUserExist } from '~/apis'

const oidcConfig = {
  onSignIn: () => {

    window.location.href = '/home'

  },
  authority: 'https://feid.ptudev.net',
  clientId: 'societe-front-end',
  redirectUri: 'http://localhost:3000/home',
  postLogoutRedirectUri: 'http://localhost:3000/login',
  scope: 'openid profile offline_access',
  responseType: 'code',
}

export default oidcConfig