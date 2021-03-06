var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

//NODE_ENV for production

var config = {
    entry: './app/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index_bundle.js',
        publicPath: '/'
    },
    resolve: {
        alias: {
            '../../theme.config$': path.join(__dirname, 'my-semantic-theme/theme.config')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'less-loader']
                }),
                test: /\.less$/
            },
            {
                test: /\.css$/,
                use: [ 'style-loader', 'css-loader']
            },
            {
                test: /\.png$/,
               loader: "url-loader?limit=100000"
             },
             {
               test: /\.jpg$/,
               loader: "file-loader"
             },
             {
              test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
               loader: 'url-loader? limit=10000&mimetype=application/font-woff'
              },
              {
               test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
               loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
              },
              {
               test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
               loader: 'file-loader'
               },
               {
               test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
               loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
              }
        ]
    },
    plugins: [new HtmlWebpackPlugin({
        template: 'app/index.html'
    }),
    new webpack.ProvidePlugin({
        "React": "react",
      }),
    new ExtractTextPlugin({
        filename: '[name].[contenthash].css',
    })
    ],
    devServer: {
        historyApiFallback: true
    }
};

if(process.env.NODE_ENV === 'production'){
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env' : {
                'NODE_ENV': JSON.stringify('production')
        }
        }),
        new webpack.optimize.UglifyJsPlugin()
    )
}

module.exports = config;
