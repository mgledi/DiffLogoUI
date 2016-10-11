const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEVTOOOL = PRODUCTION ? 'source-map' : 'eval-source-map';

function getEntries() {
    var entries; // eslint-disable-line no-var

    if (!PRODUCTION) {
        entries = [
            'webpack-hot-middleware/client?reload=true',
            path.join(__dirname, 'src/ui/index.js')
        ];
    } else {
        entries = {
            app: path.join(__dirname, 'src/ui/index.js'),
            vendor: [
                'flexboxgrid',
                'isomorphic-fetch',
                'react',
                'react-flexbox-grid',
                'react-redux',
                'react-tap-event-plugin',
                'redux',
                'redux-thunk'
            ]
        };
    }

    return entries;
}

function getOutput() {
    const FILENAME_PATTERN = PRODUCTION ? '[name].[hash].min.js' : '[name].js';

    return {
        path: path.join(__dirname, '/dist/ui/'),
        filename: FILENAME_PATTERN,
        publicPath: '/'
    };
}

function getPlugins() {
    const plugins = [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new HtmlWebpackPlugin({
            template: 'src/ui/index.tmpl',
            inject: 'body',
            filename: 'index.html',
            minify: PRODUCTION ? {
                collapseWhitespace: true,
                html5: true,
                removeAttributeQuotes: true
            } : false
        }),
        new webpack.optimize.OccurenceOrderPlugin()
    ];

    if (!PRODUCTION) {
        plugins.push(new webpack.HotModuleReplacementPlugin());
        plugins.push(new webpack.NoErrorsPlugin());
    } else {
        plugins.push(new webpack.optimize.UglifyJsPlugin({ comments: false, screwIE8: true, compress: { warnings: false } }));
        plugins.push(new webpack.optimize.CommonsChunkPlugin({ names: ['vendor'] }));
        plugins.push(new webpack.optimize.DedupePlugin());
    }

    return plugins;
}

function getLoaders() {
    const loaders = [
        {
            test: /\.js?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['react', 'es2015', 'stage-0']
            }
        },
        {
            test: /\.css$/,
            loader: 'style!css?modules',
            include: /flexboxgrid/
        }
    ];

    if (!PRODUCTION) {
        loaders[0].query.presets.push('react-hmre');
    }

    return loaders;
}

module.exports = {
    devtool: DEVTOOOL,
    entry: getEntries(),
    output: getOutput(),
    plugins: getPlugins(),
    module: {
        loaders: getLoaders()
    }
};
