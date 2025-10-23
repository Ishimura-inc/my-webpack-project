const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.ts", // входной файл
  output: {
    filename: "bundle.js", // имя выходного файла
    path: path.resolve(__dirname, "dist"), // папка сборки
    clean: true, // очищает dist перед каждой сборкой
  },
  mode: "development", // режим сборки ('development' или 'production')
  devtool: "source-map", // для удобной отладки
  module: {
    rules: [
      {
        test: /\.ts$/, // обрабатываем все .ts файлы
        use: "ts-loader", // используем ts-loader для TypeScript
        exclude: /node_modules/, // исключаем node_modules
      },
      {
        test: /\.scss$/, // обрабатываем все .scss файлы
        use: ["style-loader", "css-loader", "sass-loader"], // порядок важен!
      },
      {
        test: /\.css$/, // обрабатываем обычные .css файлы (для Swiper и других библиотек)
        use: ["style-loader", "css-loader"], // подключаем через style-loader и css-loader
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"], // чтобы можно было импортировать без указания расширения
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // HTML-шаблон
    }),
  ],
  devServer: {
    static: "./dist", // где искать готовые файлы
    open: true, // открывает браузер автоматически
    hot: true, // автообновление без перезагрузки
  },
};