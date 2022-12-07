const { override, addBabelPlugin, addWebpackModuleRule } = require('customize-cra');

module.exports = override(
    addBabelPlugin('babel-plugin-transform-react-pug'),
    addBabelPlugin([ 'babel-plugin-transform-jsx-classname-components', {
        objects: [ 'React', 'ThemeContext', 'ErrorStatusContext', 'AuthContext' ]
    } ]),
    addWebpackModuleRule({
        test: /\bmapbox-gl-csp-worker.js\b/i,
        use: { loader: 'worker-loader' }
    })
);