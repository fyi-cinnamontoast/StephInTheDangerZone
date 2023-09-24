module.exports = {
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
    resolve: {
        extensions: ['.ts', '.js'],
    },
}