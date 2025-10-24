# Слайдер

Инструкция по его запуску в WebStorm!

Вначале слева сверху жмем на бургер, там кликаем на "open" и выбираем будущую папку родителя.
папку лучше заготовить заранее и от греха под дальше кирилицы желательно что бы в путях не было.
допустим C:\slider\ наш путь
Выбрали подтвердили

далее слева снизу есть значок консоли, жмем открывается консоль

---

## Копируем содержимое с репозитория git clone
`git clone https://github.com/Ishimura-inc/my-webpack-project.git`

Он все скопирует, вот все что он скопировал должно быть в корне папки C:\slider\
Если он скопировал так что получилось C:\slider\my-webpack-project и там все файлы внутри
вырезаем их от туда и перемещаем в C:\slider\
Есть небольшая вероятность что так делать смысла нет, у меня не было времени разобраться как правильно подтягивать файлы.

---

## Далее команду в консоль
`npm install`

далее набираем

`npm start` и он откроет браузер по пути http://localhost:8080/

Если надо открыть на мобиле то что запускает сборщик webpack из webstorm то
нужен будет
android studio от get brains
на телефоне включить режим разработчика
подключить телефон к пк с разрашениями на телефоне
подключить adb из sdk
в консоле android studio вписываем
`adb version`
и смотрим версию, если все ок то покажет версию
если ок то вписываем в консоль android studio
`adb reverse tcp:8080 tcp:8080`
и после открываем на телефоне
http://localhost:8080

---
## Установлено во время сборки:
- node.js v24.5.0
- css-loader@7.1.2
- gsap@3.13.0
- html-webpack-plugin@5.6.4
- sass-loader@16.0.5
- sass@1.93.2
- style-loader@4.0.0
- swiper@12.0.3
- ts-loader@9.5.4
- typescript@5.9.3
- webpack-cli@6.0.1
- webpack-dev-server@5.2.2
- webpack@5.102.1

## Структура:
---

- src
- - assets/fonts
- - - BebasNeue-Regular.woff2
- - - PTSans-Bold.woff2
- - - PTSans-BoldItalic.woff2
- - - PTSans-Italic.woff2
- - - PTSans-Regular.woff2
- - styles
- - - fonts.scss
- - - krug.scss
- - - main.scss
 - index.html
 - index.ts
- .gitignore
- package-lock.json
- package.json
- readme.md
- tsconfig.json
- webpack.config.js