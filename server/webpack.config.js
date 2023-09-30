const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
    externals: {
        sqlite3: 'commonjs sqlite3',
    },
    mode: "development",
    target: 'node',
    entry: './src/main.ts',
    output: {
        filename: 'bundle.js'
        
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: '/node_modules/',
            }
        ],
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: "src/static" }
            ]
        })
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
}