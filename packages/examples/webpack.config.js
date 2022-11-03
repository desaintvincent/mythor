const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')

const path = require('path')
const fs = require('fs')

const examplesDir = path.resolve(__dirname, './src/examples/')

// @todo sort by number

const examples = fs
  .readdirSync(examplesDir, {
    withFileTypes: true,
  })
  .filter((file) => file.isFile())
  .sort()
  .map((file) => ({
    name: file.name
      .replace(/\.[^/.]+$/, '')
      .split('--')
      .pop(),
    path: file.name,
  }))

const exampleNames = examples.map((example) => example.name)

const typescriptEntries = examples.reduce(
  (acc, curr) => ({
    ...acc,
    [curr.name]: path.resolve(examplesDir, curr.path),
  }),
  {}
)

module.exports = {
  mode: 'development',
  entry: {
    ...typescriptEntries,
    cssGlobal: path.resolve(__dirname, './src/templates/global.css'),
    cssIndex: path.resolve(__dirname, './src/templates/index.css'),
    cssExample: path.resolve(__dirname, './src/templates/example.css'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [miniCssExtractPlugin.loader, 'css-loader'],
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
        ...examples.map((entry) => ({
          from: `/${entry}`,
          to: `/${entry}.html`,
        })),
        { to: '/index.html' },
      ],
    },
  },
  plugins: [
    new miniCssExtractPlugin(),
    new htmlWebpackPlugin({
      exampleNames,
      template: path.resolve(__dirname, 'src/templates/index.html'),
      filename: `index.html`,
      chunks: ['cssGlobal', 'cssIndex'],
      devServer: true,
    }),
    ...examples.map(
      (entry) =>
        new htmlWebpackPlugin({
          exampleNames,
          template: path.resolve(__dirname, 'src/templates/example.html'),
          filename: `${entry.name}.html`,
          chunks: ['cssGlobal', 'cssExample', entry.name],
          devServer: true,
          title: entry.name,
        })
    ),
  ],
  optimization: {
    runtimeChunk: 'single',
  },
}
