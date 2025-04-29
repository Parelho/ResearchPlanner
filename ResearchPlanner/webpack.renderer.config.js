const rules = require("./webpack.rules");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

rules.push({
  test: /\.css$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader" },
    {
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: [require("tailwindcss"), require("autoprefixer")],
        },
      },
    },
  ],
});

module.exports = {
  module: {
    rules,
  },
  output: {
    publicPath: '/',
  },
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
       template: path.resolve(__dirname, 'src/index.html'),
       publicPath: '/',
    })
 ]
};
