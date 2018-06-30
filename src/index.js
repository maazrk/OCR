import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom'
import { Switch, Route } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route render={(props) => (
                <App {...props} />
            )} />
        </Switch>
    </BrowserRouter>
, document.getElementById('root'));
registerServiceWorker();
