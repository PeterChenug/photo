/**
 * Created by peterzhang on 2017/4/25.
 */
var config = require('./webpack.config')
var webpack = require('webpack')

config.plugins.push(new webpack.DefinePlugin({
    __ENV__: JSON.stringify({resource: ''})
}))


module.exports = config;
