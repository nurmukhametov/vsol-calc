# Калькулятор стартовой силы состава ВСОЛ

Калькулятор представляет собой расширение для браузера (Mozilla, Chrome),
которое позволяет в контексте страницы отправки состава оценить стартовую силу
состава с учётом спецвозможностей, формы, усталости, стиля и погоды.

## Установка расширения из магазина расширений

### Mozilla Firefox

Установка производится на
[странице](https://addons.mozilla.org/ru/firefox/addon/start-strength-calculator/)
в официальном магазине расширений Mozilla.

### Chrome, Chromium, Yandex Browser

Установка производится на
[странице](https://chrome.google.com/webstore/detail/start-strength-calculator/fbkocnjoehppkjfhklkljejnlkohphif?hl=ru)
в официальном магазине расширений Google.

## Разработчикам

Любые изменения и улучшения приветствуются.

### Структура проекта

Большая часть кодовой базы общая, однако manifest.json разный для Chrome и
Firefox. Поэтому версии для конкретных браузеров располагаются на
соответствующих ветках.

TODO как устроено расширение.

### Установка расширения из исходного кода

#### Mozilla Firefox

На странице about:addons нажать на шестерёнку -> "Debug Add-ons" -> "Load
Temporary Add-on..." и выбрать в диалоговом окне zip архив с расширением.

Кроме того, можно запускать с помощью web-ext

    web-ext run

#### Chrome, Chromium

В меню выбрать "More Tools" -> "Extensions" -> "Load Unpacked" и выбрать в
диалоговом окне директорию с расширением.

### Запаковка расширения

    web-ext lint
    web-ext build
