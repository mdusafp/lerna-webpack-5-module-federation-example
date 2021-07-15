import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { container } from "webpack";
import { dependencies } from "../../../package.json";
import { bundleRule, tsRule } from "../../shared/webpack/rules";

const { ModuleFederationPlugin } = container;

const isProduction = process.env.NODE_ENV === "production";
const devtool = isProduction ? "source-map" : "cheap-module-source-map";

const config = {
  entry: {
    app: "./src/index",
  },
  output: {
    path: path.resolve(process.cwd(), "dist"),
    filename: "[name].[contenthash].js",
    publicPath: "http://localhost:3002/",
  },
  devServer: {
    port: 3002,
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
    new ModuleFederationPlugin({
      name: "app_remote",
      filename: "remoteEntry.js",
      library: { type: "var", name: "app_remote" },
      exposes: {
        "./page": "./src/components/page",
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
