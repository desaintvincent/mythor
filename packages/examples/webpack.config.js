const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const fs = require('fs')

const filesDir = __dirname + '/src/examples/'

// @todo sort by number

const entries = fs
  .readdirSync(filesDir, {
    withFileTypes: true,
  })
  .filter((file) => file.isFile())
  .map((file) => file.name.replace(/\.[^/.]+$/, ''))

module.exports = {
  mode: 'development',
  entry: entries.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: `${filesDir}${curr}.ts`,
    }),
    {}
  ),
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: './dist',
    historyApiFallback: {
      rewrites: [
        ...entries.map((entry) => ({
          from: `/${entry}`,
          to: `/${entry}.html`,
        })),
        { to: '/index.html' },
      ],
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`,
      chunks: [],
    }),
    ...entries.map(
      (entry) =>
        new HtmlWebpackPlugin({
          entries,
          template: 'src/templates/example.html',
          filename: `${entry}.html`,
          chunks: [entry],
          title: entry,
        })
    ),
  ],
  optimization: {
    runtimeChunk: 'single',
  },
}
