var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname,
        filename: './dist/rest-linked.js',
        library: 'restLinked',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            { 
                test: path.join(__dirname, 'src'),
                loader: 'babel-loader' 
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: { 
                warnings: false 
            }
        })
    ] 
};