const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

const PATHS = {
  source: path.join(__dirname, "src"),
  source_assets: path.join(__dirname, "src/assets"),
  build: path.join(__dirname, "dist"),
  build_assets: path.join(__dirname, "dist/assets"),
};

module.exports = {
  entry: "./src/app.tsx",
  output: {
    filename: "main.js",
    path: PATHS.build,
    publicPath: "/",
  },

  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: PATHS.source_assets,
          to: PATHS.build_assets,
        },
      ],
    }),
    /*  конфликт с typeScript
   new webpack.SourceMapDevToolPlugin({}), */
  ],
  mode: "production",
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(jpg|png|svg|gif)$/,
        loader: "file-loader",
        options: {
          name: "assets/[name].[ext]",
          emitFile: false,
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "dist"),
    port: 8060,
  },
  /*  externals: {
    'react': "React",
    "react-dom": "ReactDOM",
  }, */
};
