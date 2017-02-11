import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import configureStore from './store/store';
import ReactGA from 'react-ga';

import Root from './container/Root';

injectTapEventPlugin();

const store = configureStore();
const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Root store={store} history={history} />
    , document.getElementById('root'));

ReactGA.initialize('UA-88450928-1');
ReactGA.pageview(window.location.pathname);
