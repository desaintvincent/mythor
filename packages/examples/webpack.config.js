const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin = require('mini-css-extract-plugin')

const path = require('path')
const fs = require('fs')

const examplesDir = path.resolve(__dirname, './src/examples/')

function getExampleName(fileName) {
  return fileName
    .replace(/\.[^/.]+$/, '')
    .replace(/_/g, ' ')
    .split('--')
    .pop()
}

function getEntryName(relativePath) {
  return relativePath.replace(/\.[^/.]+$/, '').replace(/[\\/]/g, '__')
}

function getExamples() {
  return fs
    .readdirSync(examplesDir, {
      withFileTypes: true,
    })
    .filter((file) => file.isDirectory())
    .sort((left, right) => left.name.localeCompare(right.name))
    .flatMap((category) =>
      fs
        .readdirSync(path.join(examplesDir, category.name), {
          withFileTypes: true,
        })
        .filter((file) => file.isFile() && file.name.endsWith('.ts'))
        .sort((left, right) => left.name.localeCompare(right.name))
        .map((file) => ({
          category: category.name,
          name: getExampleName(file.name),
          path: `${category.name}/${file.name}`,
        }))
    )
    .sort((left, right) => left.path.localeCompare(right.path))
}

function getExampleGroups(examples) {
  return examples.reduce((groups, example) => {
    const group = groups.find((entry) => entry.category === example.category)

    if (group) {
      group.examples.push(example)
      return groups
    }

    groups.push({
      category: example.category,
      examples: [example],
    })

    return groups
  }, [])
}

const examples = getExamples()
const exampleGroups = getExampleGroups(examples)

const typescriptEntries = examples.reduce(
  (acc, curr) => ({
    ...acc,
    [getEntryName(curr.path)]: path.resolve(examplesDir, curr.path),
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
      {
        test: /\.(?:wav|mp3|ogg)$/i,
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
  devtool: 'source-map',
  devServer: {
    port: 9999,
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
      exampleGroups,
      template: path.resolve(__dirname, 'src/templates/index.html'),
      filename: `index.html`,
      chunks: ['cssGlobal', 'cssIndex'],
      title: 'Mythor',
    }),
    ...examples.map(
      (entry) =>
        new htmlWebpackPlugin({
          exampleGroups,
          template: path.resolve(__dirname, 'src/templates/example.html'),
          filename: `${entry.path}.html`,
          chunks: ['cssGlobal', 'cssExample', getEntryName(entry.path)],
          title: `Mythor: ${entry.name}`,
          path: entry.path,
          category: entry.category,
        })
    ),
  ],
  optimization: {
    runtimeChunk: 'single',
  },
}
