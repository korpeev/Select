const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const { default: ImageminWebpackPlugin } = require("imagemin-webpack-plugin")
const imageminMozjpeg = require("imagemin-mozjpeg")

const isDev = process.env.NODE_ENV === "development"
const isProd = !isDev

//hash for produciton
const file = (ext) => (isDev ? `[name].${ext}` : `[name].[hash].${ext}`)

//optimization
const optimization = () => {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  }

  if (isProd) {
    config.minimizer = [new TerserPlugin(), new OptimizeCssAssetsPlugin()]
  }
  return config
}

module.exports = {
  mode: "development",
  entry: [
    "@babel/polyfill",
    "webpack-dev-server/client?http://localhost:8080/",
    "./src/index.js",
  ],
  output: {
    filename: file("js"),
    path: path.resolve(__dirname, "dist"),
  },
  optimization: optimization(),
  devtool: isDev ? "source-map" : false,
  devServer: {
    port: 8081,
    inline: true,
    watchOptions: {
      poll: true,
    },
    hot: true,
    contentBase: "./",
    watchContentBase: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: `assets/css/${file("css")}`,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          context: path.resolve(__dirname, "src"),
          from: "assets/img",
          to: "assets/img",
          noErrorOnMissing: true,
        },
      ],
    }),
    new ImageminWebpackPlugin({
      disable: isDev,
      pngquant: { quality: [0.5, 0.5] },
      plugins: [imageminMozjpeg({ quality: 45 })],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: { config: "./postcss.config.js" },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        // options: {
        //   babelrc: true,
        // },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: { name: "assets/img/[name][ext]" },
          },
        ],
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader",
      },
      {
        test: /\.(otf|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader",
        options: {
          limit: 10000,
          name: "assets/fonts/[name].[ext]",
        },
      },
    ],
  },
}
