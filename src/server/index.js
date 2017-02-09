/* eslint-disable no-var */

var path = require('path');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var uuid = require('uuid');
var FileStore = require('session-file-store')(session);

var ui = require('./routes/static');
var fileRoutes = require('./routes/file');
var diffLogoRoute = require('./routes/diffLogo');
var seqLogoRoute = require('./routes/seqLogo');
var resultRoutes = require('./routes/results');

var app = express();

module.exports = function server(options) {
    var PRODUCTION = !options.dev;
    var webpack = PRODUCTION ? null : require('webpack');
    var webpackMiddleware = PRODUCTION ? null : require('webpack-dev-middleware');
    var webpackHotMiddleware = PRODUCTION ? null : require('webpack-hot-middleware');
    var config = PRODUCTION ? null : require('../../webpack.config.js');
    var compiler = PRODUCTION ? null : webpack(config);
    var middleware = null;
    var sessionConfig = {
        genid: uuid.v4,
        store: new FileStore(),
        secret: options.secret,
        resave: false,
        saveUninitialized: true,
        ttl: 60 * 60 * 24,
        cookie: {
            path: '/',
            httpOnly: true,
            maxAge: null
        }
    };
    var rsource = path.resolve(process.cwd(), options.rsource);
    app.use(session(sessionConfig));
    app.use(bodyParser.json());

    if (PRODUCTION) {
        app.use(express.static(path.join(process.cwd(), 'ui')));
    } else {
        middleware = webpackMiddleware(compiler, {
            publicPath: config.output.publicPath,
            contentBase: 'ui',
            stats: {
                colors: true,
                hash: false,
                timings: true,
                chunks: false,
                chunkModules: false,
                modules: false
            }
        });

        app.use(middleware);
        app.use(webpackHotMiddleware(compiler));
    }

    app.use('/', ui(middleware, PRODUCTION));
    app.use('/files', fileRoutes);
    app.use('/diffLogo', diffLogoRoute(rsource));
    app.use('/seqLogo', seqLogoRoute(rsource));
    app.use('/results', resultRoutes);

    app.listen(options.port, () => console.log('App is listen to port ', options.port)); // eslint-disable-line no-console
};
