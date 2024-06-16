import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import persistStore from 'redux-persist/es/persistStore'

const persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store} >
    <PersistGate persistor={persistor}>
      <BrowserRouter>
        <App />
        <ToastContainer position="top-right" theme="colored" />
      </BrowserRouter>
    </PersistGate>
  </Provider>
  // </React.StrictMode>
)
