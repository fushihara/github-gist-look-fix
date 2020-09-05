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
    path: path.resolve(__dirname, 'out'),
  },
  resolve: {
    extensions: ['.ts', '.js',],
  },
};