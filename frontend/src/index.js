import React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import { BrowserRouter, Route } from "react-router-dom";

render(
    <React.StrictMode>
        <BrowserRouter>
            <Route path='/' component={App} />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('app')
);
