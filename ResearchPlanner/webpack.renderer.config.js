const rules = require("./webpack.rules");
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');

const env = dotenv.config().parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

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

rules.push({
  test: /\.(png|jpe?g|gif|svg)$/i,
  type: 'asset/resource',
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
      meta: {
        'Content-Security-Policy': {
          'http-equiv': 'Content-Security-Policy',
          content: `
            default-src 'self';
            style-src 'self' https://unpkg.com 'unsafe-inline';
            connect-src 'self' https://*.supabase.co;
            script-src 'self' 'unsafe-inline';
          `.replace(/\s{2,}/g, ' ').trim()
        }
      }
    }),
    new webpack.DefinePlugin(envKeys),
  ]
};
