import React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import { BrowserRouter, Route } from "react-router-dom";

// import main scss stylesheet (bootstrap css is imported here)
import '../static/css/main.scss';

// import bootstrap
import 'bootstrap';

render(
    <React.StrictMode>
        <BrowserRouter>
            <Route exact path='/' component={App} />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('app')
);
