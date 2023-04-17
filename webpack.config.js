const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/script.ts",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    globalObject: "this",
    filename: "bundle.js",
    path: path.resolve(__dirname, "static"),
    library: "generator",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "static"),
    },
    compress: true,
    port: 9000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      filename: "./index.html", //relative to root of the application
      publicPath: "/static",
      templateContent: `
<html>
    <body>
        <div id="root"></div>
    </body>
</html>
  `,
    }),
  ],
};
