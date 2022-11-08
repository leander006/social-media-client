import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import "./index.css"
import { store } from './redux/Store/store';
import { Provider } from 'react-redux';
import {Toaster} from "react-hot-toast"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <Toaster position="bottom-center" reverseOrder={false}/>
    <App />
  </Provider>
);

