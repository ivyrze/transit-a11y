const { override, addBabelPlugin, addWebpackPlugin, addWebpackModuleRule } = require('customize-cra');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

module.exports = override(
    addBabelPlugin('babel-plugin-transform-react-pug'),
    addBabelPlugin([ 'babel-plugin-transform-jsx-classname-components', {
        objects: [ 'React', 'ThemeContext', 'ErrorStatusContext', 'AuthContext' ]
    } ]),
    addWebpackPlugin(new PreloadWebpackPlugin({
        fileBlacklist: [ /\.map/, /(?<!regular)-italic/ ]
    })),
    addWebpackModuleRule({
        test: /\bmapbox-gl-csp-worker.js\b/i,
        use: { loader: 'worker-loader' }
    })
);