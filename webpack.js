const path = require('path');

const webpack = require("webpack")
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: {
    global: './src/global.ts',
    index: './src/index.tsx',
  },
  output: {
    filename: '[name]-[chunkhash:8].js',
    path: path.resolve(__dirname, "dist/"),
    publicPath: '/',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      process: "process/browser"
    },
  },
  optimization: {
    runtimeChunk: 'single',
    minimize: false
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: ["/.yarn/", "/src/tests/"],
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            sources: {
              list: [{
                  tag: 'img',
                  attribute: 'src',
                  type: 'src',
                },
                {
                  tag: 'audio',
                  attribute: 'src',
                  type: 'src',
                }
              ]
            }
          }
        }
      },
      {
        test: /(draco_decoder\.wasm|draco_wasm_wrapper\.js)$/,
        use: [{
          loader: 'file-loader',
          options: {
            publicPath: "assets",
            outputPath: 'lib/draco',
            name: '[name].[ext]',
            esModule: true
          }
        }]
      },
      {
        test: /\.(glb|gltf)$/,
        use: [{
          loader: 'file-loader',
          options: {
            publicPath: "assets",
            outputPath: 'assets/',
            name: '[name]-[contenthash:8].[ext]',
            esModule: true
          }
        }]
      },
      {
        test: /\.(jpg|png|hdr|HDR)$/,
        use: [{
          loader: 'file-loader',
          options: {
            outputPath: 'assets/',
            name: '[name]-[contenthash:8].[ext]',
            esModule: false
          }
        }]
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    // Clean dist/ on each build
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      process: 'process/browser'
    }),
    new NodePolyfillPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      // Input path
      template: 'src/index.html',
      // Output (within dist/)
      filename: `index.html`,
      // Inject compiled JS into <head> (as per A-Frame docs)
      inject: 'head',
      // Specify which JS files, by key in `entry`, should be injected into the page
      chunks: ['global', 'index'],
      scriptLoading: 'defer', //blocking
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  devServer: {
    host: "localhost",
    writeToDisk: true,
    port: 8081,
    writeToDisk: false,
    hot: true,
    watchContentBase: true,
    contentBase: [
      path.join(__dirname, 'dist'),
    ],
    proxy: {
      "/api": {
        target: "http://localhost:5000"
      }
    }
  },
};