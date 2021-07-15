import { RuleSetRule } from "webpack";

export const bundleRule: RuleSetRule = {
  test: /bootstrap\.tsx$/,
  loader: 'bundle-loader',
  options: {
    lazy: true,
  },
}

export const tsRule: RuleSetRule = {
  test: /\.tsx?$/,
  loader: 'babel-loader',
  options: {
    presets: ['@babel/preset-react', '@babel/preset-typescript'],
  },
}

