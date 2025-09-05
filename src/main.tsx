import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './style.css'

createRoot(document.getElementById('root')!).render(
  // Temporarily disable StrictMode to prevent double API calls during development
  // <React.StrictMode>
    <Provider store={store}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </Provider>
  // </React.StrictMode>,
)
