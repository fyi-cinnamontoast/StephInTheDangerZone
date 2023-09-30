const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = [
  {
    mode: "development",
    entry: "./src/index.ts",
    devtool: "source-map",
    output: {
      path: path.join(__dirname, "../dist"),
      filename: "main.js",
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          loader: "ts-loader",
        },
        {
          test: /\.(png|svg|jpg|gif|ico)$/,
          use: "file-loader?name=[name].[ext]"
        }
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
      fallback: {
        url: require.resolve('url'),
        assert: require.resolve('assert'),
        crypto: require.resolve('crypto-browserify'),
        buffer: require.resolve('buffer'),
        stream: require.resolve('stream-browserify'),
      }
    }
  }
];