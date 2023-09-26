const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = [
  {
    resolve: {
      fallbacks: {
        "http": require.resolve("stream-http")
      }
    },
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
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./dist/index.html",
        favicon: "./dist/assets/favicon.ico"
      })
    ],
  }
];