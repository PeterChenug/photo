/**
 * Created by peterzhang on 2017/4/25.
 */
require('shelljs/global');

var webpack = require('webpack')
var config = require('./webpack.prod.config')
var path = require('path')
//add test publicPath
if (process.argv[2] && process.argv[2] != 'prod') {
    config.output.publicPath = '/'
    config.plugins.push(new webpack.DefinePlugin({
        __ENV__: JSON.stringify({resource: ''})
    }))
} else {
    config.plugins.push(new webpack.DefinePlugin({
        __ENV__: JSON.stringify({resource: '//static.idevent.cn/iphotos/'})
    }))
    config.output.publicPath = '//static.idevent.cn/iphotos/'

}
var assetsPath = path.join(__dirname, '../dist')
rm("-rf", assetsPath)
webpack(config, function (err) {
    if (err) {
        throw err
    }
})

