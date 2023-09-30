const path = require("path");

module.exports = [
  {
    mode: "production",
    entry: "./src/index.ts",
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
          use: ['file-loader?name=[name].[ext]']
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
    },
    target: "web",
    node: {
      __dirname: false,
    }
  }
];