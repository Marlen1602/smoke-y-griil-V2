import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Registro del Service Worker para PWA
import { registerSW } from 'virtual:pwa-register'
registerSW({ onNeedRefresh() {}, onOfflineReady() {} })