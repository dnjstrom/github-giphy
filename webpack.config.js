const path = require("path")

const common = {
  devtool: "source-map",
  module: {
    rules: [
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
    entry: "./src/content.js",
    output: {
      filename: "content.js",
      path: path.resolve(__dirname, "dist"),
    },
    ...common,
  },
  {
    entry: "./src/background.js",
    output: {
      filename: "background.js",
      path: path.resolve(__dirname, "dist"),
    },
    ...common,
  },
]
