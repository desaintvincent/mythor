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
      .replace(/_/g, ' ')
      .split('--')
      .pop(),
    path: file.name,
  }))

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
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        loader: 'file-loader',
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
    port: 9000,
    static: './dist',
    hot: true,
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
      examples,
      template: path.resolve(__dirname, 'src/templates/index.html'),
      filename: `index.html`,
      chunks: ['cssGlobal', 'cssIndex'],
      title: 'mythor',
    }),
    ...examples.map(
      (entry) =>
        new htmlWebpackPlugin({
          examples,
          template: path.resolve(__dirname, 'src/templates/example.html'),
          filename: `${entry.path}.html`,
          chunks: ['cssGlobal', 'cssExample', entry.name],
          title: entry.name,
          path: entry.path,
        })
    ),
  ],
  optimization: {
    runtimeChunk: 'single',
  },
}
