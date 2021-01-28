const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = (env, options) => {
  const isProduction = options.mode === 'production';

  const config = {
    mode: isProduction ? 'production' : 'development',
    devtool: isProduction ? false : 'source-map',
    watch: !isProduction,
    entry: ['./src/index.js', './src/style.css'],
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      assetModuleFilename: 'img/[name][ext][query]',
      publicPath: ''
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      index: 'index.html',
      open: 'Google Chrome',
      overlay: true,
      port: 8080
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ["@babel/plugin-proposal-class-properties"]
            }
          }
        }, 
        {
          test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './',
            },
          },
          'css-loader',
        ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.html$/i,
          loader: 'html-loader',
          options: {
            minimize: false
          }
        },
        // {
        //   test: /\.(png|svg|jpg|jpeg|gif)$/i,
        //   use: [
        //     'file-loader'
        //   ]
        // },
      ]
    },
    plugins: [
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
      new CopyPlugin({
        patterns: [
          { from: 'src/assets/audio', to: 'audio' },
          { from: 'src/assets/images', to: 'img' },
        ],
      }),
      new HtmlWebpackPlugin({
        template: 'index.html'
      }),
      new MiniCssExtractPlugin({
        filename: 'style.css'
      }),
    ],
  }
  return config;
};