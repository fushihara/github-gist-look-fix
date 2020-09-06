const webpack = require('webpack');
const path = require("path");
module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  devtool: "inline-source-map",
  module: {
    rules: [
      { // これが無いと、funtion a(...b:any) でエラーが出る
        test: /\.ts$/,
        use: "ts-loader"
      }
    ],
  },
  output: {
    filename: "script.user.js",
    path: path.resolve(__dirname, 'out'),
  },
  resolve: {
    extensions: ['.ts', '.js',],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `// ==UserScript==
      // @name         gist github look fix
      // @namespace    https://github.com/fushihara/github-gist-look-fix
      // @match        https://nomatch.example.com
      // @description  gist.githubのembedの外見を修正
      // @version      ${process.env.npm_package_version}
      // @grant        none
      // @license      MIT
      // @source       https://github.com/fushihara/github-gist-look-fix
      // @homepage     https://greasyfork.org/ja/scripts/410890
      // @noframes
      // ==/UserScript==`.split("\n").map(a => a.trim()).join("\n"),
      raw: true,
    })
  ]
};