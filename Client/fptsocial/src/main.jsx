import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from './redux/store.js'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import persistStore from 'redux-persist/es/persistStore'
import '@mantine/core/styles.css'
import './index.css'
import '@mantine/tiptap/styles.css';
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'

import { MantineProvider, Tabs, createTheme } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals'

const cache = createCache(
  { key: 'mantine', prepend: false },
)
const persistor = persistStore(store)
const theme = createTheme({
  components: {
    Tabs: Tabs.extend({
      classNames: {

      }
    })
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CacheProvider value={cache}>
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Provider store={store} >
          <PersistGate persistor={persistor}>
            <BrowserRouter>
              <App />
              <ToastContainer position="top-right" theme="colored" />
            </BrowserRouter>
          </PersistGate>
        </Provider>
      </ModalsProvider>
    </MantineProvider>
  </CacheProvider>
  // </React.StrictMode>
)
