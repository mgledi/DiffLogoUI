import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Home from './container/Home';
import App from './container/App';
import About from './container/About';

export default <Route path="/" component={App}>
    <IndexRoute component={ Home } />
    <Route path="about" component={About} />
    </Route>;

