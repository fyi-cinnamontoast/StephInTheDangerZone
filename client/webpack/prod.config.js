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
    },
    target: "web",
    node: {
      __dirname: false,
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 8080,
    },
  }
];