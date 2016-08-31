module.exports = {
    entry: "./index.js",
    output: {
        //path: 'build',
        filename: "./dist/bundle.js",
        //publicPath: "http://www.baidu.com/"
    },
    module: { loaders: [
      { test: /\.css$/, loader: "style!css" },
      { test: /\.scss$/, loader: "style!css!sass" },
  		{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8&name=dist/img/[hash:8].[name].[ext]'},
      { test: /\.html$/,loader: "html"}
  	]},
    htmlLoader: {
    	ignoreCustomFragments: [/\{\{.*?}}/]
    }
  }
