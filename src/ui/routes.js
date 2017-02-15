import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Home from './container/Home';
import App from './container/App';
import About from './container/About';
import Cite from './container/Cite';
import FileFormats from './container/FileFormats';

export default <Route path="/" component={App}>
    <IndexRoute component={ Home } />
    <Route path="about" component={About} />
    <Route path="cite" component={Cite} />
    <Route path="fileformats" component={FileFormats} />
    </Route>;
