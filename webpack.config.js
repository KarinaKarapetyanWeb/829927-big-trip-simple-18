const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  // Указываем путь до входной точки:
  entry: "./src/main.js",
  // Описываем, куда следует поместить результат работы:
  output: {
    // Имя файла со сборкой:
    filename: "bundle.js",
    // Путь до директории (важно использовать path.resolve):
    path: path.resolve(__dirname, "build"),
    // Очистка директории для сборки перед новой сборкой:
    clean: true,
  },
  // Генерация source-maps:
  devtool: "source-map",
  // Конфиг плагинов
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "public" }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ],
  },
};
