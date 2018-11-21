const path = require("path")

const common = {
  mode: process.env.NODE_ENV || "development",
  devtool: "source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
}

module.exports = [
  {
    entry: "./src/content.ts",
    output: {
      filename: "content.js",
      path: path.resolve(__dirname, "dist"),
    },
    ...common,
  },
  {
    entry: "./src/background.ts",
    output: {
      filename: "background.js",
      path: path.resolve(__dirname, "dist"),
    },
    ...common,
  },
]
