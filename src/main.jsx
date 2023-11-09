import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

Array.prototype.count = function (value) {
    return this.reduce((acc, it) => value === it ? acc + 1 : acc, 0)
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
