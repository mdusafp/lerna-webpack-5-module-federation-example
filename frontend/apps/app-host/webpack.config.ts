import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import HtmlWebpackTagsPlugin from "html-webpack-tags-plugin";
import { container } from "webpack";
import { dependencies } from "../../../package.json";
import { bundleRule, tsRule } from "../../shared/webpack/rules";

const { ModuleFederationPlugin } = container;

const remoteHosts = ["http://localhost:3002"];

const isProduction = process.env.NODE_ENV === "production";
const devtool = isProduction ? "source-map" : "cheap-module-source-map";

const config = {
  entry: {
    app: "./src/index",
  },
  output: {
    path: path.resolve(process.cwd(), "dist"),
    filename: "[name].[contenthash].js",
    publicPath: "http://localhost:3001/",
  },
  devServer: {
    port: 3001,
    contentBase: [path.resolve(process.cwd(), "dist")],
    quiet: false,
    noInfo: false,
    disableHostCheck: true,
    inline: false,
    watchOptions: {
      aggregateTimeout: 2000,
      poll: 2000,
    },
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: true,
      modules: false,
      publicPath: true,
      timings: true,
      version: true,
      warnings: true,
      colors: true,
    },

    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({ template: "./src/index.html" }),
    new HtmlWebpackTagsPlugin({
      tags: remoteHosts.map((remoteHost) => `${remoteHost}/remoteEntry.js`),
      append: false, // prepend this as needs to be loaded before application-home
      publicPath: false,
    }),
    new ModuleFederationPlugin({
      name: "app_host",
      filename: "remoteEntry.js",
      library: { type: "var", name: "app_host" },
      remotes: {
        app_remote: "app_remote",
      },
      shared: {
        react: {
          eager: true,
          singleton: true,
          requiredVersion: dependencies.react,
        },
        "react-dom": {
          eager: true,
          singleton: true,
          requiredVersion: dependencies["react-dom"],
        },
      },
    }),
  ],
  resolve: {
    symlinks: true,
    modules: ["src", "node_modules"],
    enforceExtension: false,
    extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".json"],
  },
  mode: isProduction ? "production" : "development",
  devtool,
  target: "web",
  watchOptions: {
    aggregateTimeout: 3000,
    poll: 3000,
  },
  stats: {
    children: false,
    modules: false,
    warnings: false,
  },
  module: {
    rules: [bundleRule, tsRule],
  },
  optimization: isProduction
    ? {
        splitChunks: {
          cacheGroups: {
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: "react",
              chunks: "all",
            },
            commons: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              chunks: "all",
              priority: -20,
            },
          },
        },
      }
    : {},
};

export default config;
