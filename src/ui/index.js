import React from 'react';
import ReactDOM from 'react-dom';
import App from './container/App.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import configureStore from './store';

injectTapEventPlugin();

ReactDOM.render(
    <Provider store={ configureStore() } >
        <MuiThemeProvider>
            <App />
        </MuiThemeProvider>
    </Provider>
    , document.getElementById('root'));
