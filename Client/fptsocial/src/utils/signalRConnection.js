
import * as signalR from '@microsoft/signalr'
import { API_ROOT } from './constants'
const jwtToken = JSON.parse(window.sessionStorage.getItem('oidc.user:https://feid.ptudev.net:societe-front-end'))?.access_token

const connectionSignalR = new signalR.HubConnectionBuilder()
  .withUrl(`${API_ROOT}/notificationsHub`, {
    accessTokenFactory: () => jwtToken,
    transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
  })
  .withAutomaticReconnect()
  .build()

export default connectionSignalR