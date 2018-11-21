const path = require("path")

const common = {
  mode: process.env.NODE_ENV || "development",
  devtool: "source-map",
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
}

module.exports = [
  {
    entry: "./src/content.tsx",
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
