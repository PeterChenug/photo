/**
 * Created by peter on 17/3/2.
 */
const utils = require('./utils')
const webpack = require('webpack')
const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const _root = path.resolve(process.cwd())
const _viewPath = path.resolve(_root, 'views')

//获取入口文件
const entry = (() => {
    let entryFiles = glob.sync(_viewPath + '/**/*.{js, jsx}')

    let entry = {}
    //公共入口文件
    entryFiles.forEach((filePath) => {
        let fileReal = filePath.replace(_viewPath,'')
        fileReal = fileReal.substring(1, fileReal.lastIndexOf('\/'))
        let filename = fileReal.split('/').join('_')
        entry[filename] = [filePath]
    })
    entry['app'] = [path.resolve(_root, 'assets/js/app')]
    return entry
})()

//获取所有的静态页面
const plugins = (() => {
    let plugins = []
    Object.keys(entry).forEach((key) => {
        if(key != 'app') {
            let filePath = entry[key][0].replace(_root + '/views/', '')
            let filename = filePath.replace('index.js', 'index.html')
            plugins.push(new HtmlWebpackPlugin({
                filename: filename,
                title:'iPhoto',
                template: path.resolve(_root, 'index.html'),
                inject: 'body',
                chunks: [key, 'app', 'vendor'],
                chunksSortMode: 'dependency',
                minify: {
                    removeComments: true,
                    minifyCSS: true,
                    minifyJS: true,

                    removeAttributeQuotes: true,
                }
            }))
        }
    })

    plugins.push(new HtmlWebpackPlugin({
        filename: 'sorry/index.html',
        title:'iPhoto',
        template: path.resolve(_root, 'sorry.html'),
        chunks: [],
        minify: {
            removeComments: true,
            minifyCSS: true,
            minifyJS: true,
            removeAttributeQuotes: true,
        }
    }))

    plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        chunks: entry,
        minChunks: function (module, count) {
            // any required modules inside node_modules are extracted to vendor
            return (
                module.resource &&
                /\.js$/.test(module.resource) &&
                module.resource.indexOf(
                    path.join(__dirname, '../node_modules')
                ) === 0
            )
        }
    }))

    plugins.push(new ExtractTextPlugin(utils.assetsPath('css/[name].[hash].css')))
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }))

    plugins.push(new webpack.HotModuleReplacementPlugin())
    plugins.push(new webpack.NoEmitOnErrorsPlugin())

    return plugins
})()

module.exports = {
    entry: entry,
    output: {
        path:  path.resolve(__dirname, '../dist'),
        publicPath: '/',
        filename: utils.assetsPath('js/[name].[hash].js'),
    },
    resolve: {
        modules: [_root, path.join(__dirname, '../node_modules')],
        extensions: ['.js', '.html', '.vue', '.css'],
        alias: {
            'vue$': 'vue/dist/vue',
            'global': path.resolve(_root, 'entry/global'),
            'components': path.resolve(_root, 'components'),
            'weui.js': path.resolve(_root, 'components/weui')
        }
    },

    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader'
        }, {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }, {
            test: /\.html$/,
            exclude: /node_modules/,
            loader: 'html-loader?minimize'
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        }, {
            test: /\.less$/,
            loader: ExtractTextPlugin.extract({
                use: [
                    "css-loader",
                    "less-loader"
                ]
            })
        }, {
            test: /\.(png|jpe?g|gif|svg|swf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 15000,
                name: utils.assetsPath('images/[name].[hash].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash].[ext]')
            }
        }]
    },

    devtool: '#source-map',
    plugins: plugins
}
