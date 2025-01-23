<div align="center">
  <img src="https://i.ibb.co/HgDkTpk/image.png" alt="Логотип бота" width="200" height="200">
  <h1>telegram-lesson</h1>
  <p>
    <a href="https://github.com/TheNofis/telegram-lesson/stargazers">
      <img src="https://img.shields.io/github/stars/TheNofis/telegram-lesson?style=social" alt="GitHub stars">
    </a>
    <a href="https://github.com/TheNofis/telegram-lesson/network/members">
      <img src="https://img.shields.io/github/forks/TheNofis/telegram-lesson?style=social" alt="GitHub forks">
    </a>
    <a href="https://github.com/TheNofis/telegram-lesson/issues">
      <img src="https://img.shields.io/github/issues/TheNofis/telegram-lesson" alt="GitHub issues">
    </a>
  </p>
</div>

`telegram-lesson` — это Telegram-бот, который отображает расписание занятий для колледжа. Проект разрабатывается командой `#include`. Бот предоставляет удобный и простой способ для студентов получать доступ к своему расписанию непосредственно через Telegram.

<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

## Запуск Проекта

Для запуска проекта необходимо:

1. **Установить пакеты**

   ```bash
   npm install -y
   ```

   <br/>

2. **Отредактировать файл `.env.example`, вставить в него ваши данные и переименовать его в `.env`. В этом файле укажите следующие переменные:**

   - `BOT_TOKEN`: Токен вашего Telegram бота.
   - `MONGODB_URI`: URI вашей MongoDB базы данных.
   - `REDIS_URL`: URL вашего Redis сервера.

<br/>

3. **После этого используйте команды:**

   Запуск проекта:

   ```bash
   npm run start
   ```

   Разработка проекта:

   ```bash
   npm run dev
   ```

<br/>
<br/>

## Структура Проекта

Проект организован в несколько ключевых директорий и файлов, каждый из которых выполняет определенную функцию:

- **api**: Содержит слой взаимодействия с API для общения с API расписания колледжа.
- **command**: Хранит обработчики команд для различных команд бота.
  - **init**: Инициализирует обработчики команд.
  - **start**: Содержит логику для команды `/start`.
  - **text**: Содержит логику для текстовых команд.
- **db**: Файлы подключения к базам данных. Определяет модели MongoDB, используемые ботом.
- **index.js**: Главный исполняемый файл.
- **menu**: Содержит структуры меню для бота.

<br/>
<br/>

## Ключевые Компоненты

### 1. Слой Взаимодействия с API

Директория `api` содержит файлы, которые отвечают за связь с внешними сервисами

- **api.js**: Файл который служит прослойкой для удобного взаимодействия с API расписания колледжа. Этот слой упрощает процесс отправки запросов к API и обработки ответов.

  ```javascript
  // Пример api.js

  // Запросы GET / POST
  async function get(url) {...}
  async function post({ url, data }) {...}

  // Класс API
  export default class API {
  // Получение групп
  static async groups() {...}

  // Получение занятий для группы
  static async lessons(groupId) {...}
  }
  ```

### 2. Обработчики Команд

Директория `command` организована в поддиректории для различных типов команд:

- **Init**: Содержит файлы, которые инициализируют обработчики команд. Эти файлы захватывают события из Telegram и запускают соответствующие файлы с логикой для этих событий.

  ```javascript
  // Пример Init.StartCommand.js

  // Подключение компонентов
  import CommandExample from "../text/Command.Example.js";

  // Класс инициализации обработчиков
  export default class InitStartCommand {
    constructor(bot) {
      this.bot = bot; // bot из telegraf
      this.initCommandList = []; // Список обработчиков
    }

    handle() {
      this.bot.on("text", async (ctx) => {
        // payload для каждого обработчика
        const payload = {...};

        // Инициализация обработчиков
        this.initCommandList = [new CommandExample(payload)];

        // Запуск обработчиков
        this.initCommandList.forEach((command) => command.handle());
      });
    }
  }
  ```

- **Text / Start**: Содержит логику для команд, с которой взаимодействуют пользователи.

  ```javascript
  // Пример Command.Start.js

  // Класс команды
  export default class CommandStart {
    constructor(bot, ctx) {...}

    async handle() {
      // Получение данных пользователя
      const text = ...;
      const chatId = ...;

      // Проверка команды
      if (text !== "/start") return;

      // Логика команды
      await ctx.reply("Добро пожаловать! Выберите вашу группу:");
    }
  }
  ```

### 3. Модели Базы Данных

Директория `db` определяет модели MongoDB, используемые ботом. Эти модели структурируют данные, хранящиеся в базе данных, обеспечивая эффективное извлечение и управление информацией пользователей.
Так-же в этой директории находятся файлы для удобного подключения к базам данных, такми как **redis** **mongoose**

- **connect** Директория с файлами для подключения к базам данных

  - **redis.js**: Файл для подключения к базе данных Redis.

    ```javascript
    // Пример redis.js

    // Получение значений из environment или задание значения по умолчанию
    const redisUrl = process.env.REDIS_URL || "redis://server.thenofis.ru:6379";

    const redisClient = await createClient({
      url: redisUrl,
    })
      // Обработка ошибок и подключение
      .on("error", (err) => console.log("Redis Client Error", err))
      .on("ready", () => console.log("Redis good connect"))
      .connect();

    export default redisClient;
    ```

  - **mongoose.js**: Файл для подключения к базе данных MongoDB.

    ```javascript
    // Пример mongoose.js

    const mongoUrl = process.env.MONGODB_URI || "mongodb://localhost:27017";

    const mongoClient = mongoose
      .set("strictQuery", false)
      // Обработка ошибок и подключение
      .connect(mongoUrl)
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.error("MongoDB not connected", err));

    export default mongoClient;
    ```

- **model** Директория с моделями базы данных

  - **User.js**: Модель пользователя.

  ```javascript
  // Пример User.js

  const User = new Schema({
    id: { type: String, default: v4(), required: true, unique: true }, // UUID пользователя внутри бота
    username: { type: String, required: true }, // username в телеграме
    telegramId: { type: Number, required: true }, // id пользователя в телеграме
    createdAt: { type: Number, default: Date.now }, // Дата создания пользователя
    groupName: { type: String, default: null }, // Название группы
    groupId: { type: Number, default: null }, // ID группы
    table: { type: Boolean, default: 0 }, // Тип отправляемой таблицы 0 - TEXT, 1 - IMAGE
  });
  ```

### 4. Главный Исполняемый Файл

Файл `index.js` является главным исполняемым файлом. Он служит точкой входа для приложения, инициализируя бота и настраивая необходимые конфигурации.

```javascript
// Пример index.js

// Подключение к базе данных
import "./db/connect/mongodb.js";

// Импорт инициализаторов обработчиков
import InitExampleCommand from "./command/init/Init.ExampleCommand.js";

// Класс бота
class Bot {
  constructor(props) {
    this.bot = {...};
    this.initCommandList = [...];
  }

  init() {
    // payload для каждого инициализатора
    const payload = ...;

    // Инициализация инициализаторов
    this.initCommandList = [new InitExampleCommand(payload)];

    // Запуск инициализаторов
    this.initCommandList.forEach((command) => command.handle());

    // Подключение к базе данных
    mongoose.connect(this.mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });

    // Запуск бота
    this.bot.launch();
  }
}

const bot = new Bot({ BOT_TOKEN: token, MONGODB_URL: mongodbUrl });
bot.init();
```

### 5. Шаблоны HTML

Директория `html` шаблон html для создания таблицы расписания, в будующем планируется добавления нескольких тем.

- **table.html** - Самый простой шаблон для создания таблицы расписания

  ```html
  <!--   Пример table.html -->

  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
      <table class="table-lessons">
        <thead>
          <tr>
            <th class="time">#</th>
            <th class="caption-lessons">Занятия</th>
          </tr>
        </thead>
        <tbody>
          {CONTENT}
        </tbody>
      </table>
    </body>
    <style>
      body {
        display: table;

        margin: 0;
        padding: 0;
      }
      /* СТИЛИ .... */
    </style>
  </html>
  ```

### 6. Структуры Меню

Директория `menu` содержит структуры меню для бота, предоставляя способ представить опции и навигацию по различным разделам бота.

```javascript
// Пример Menu.Main.js

// Импорт Markup
import { Markup } from "telegraf";

// Создание кнопок и их экспорт
export default Markup.keyboard([
  Markup.button.callback("Группы", "groups"),
  Markup.button.callback("Расписание", "schedule"),
])
  .oneTime()
  .resize();
```

### 7. Вспомогательные Компоненты

Директория `utils` файлы, которые служат для упрощения работы с таблицами.

- **createTable.js** - Функция для создания таблицы расписания PHOTO/TEXT

  ```javascript
  // Пример createTable.js

  import { readFileSync } from "fs";
  import { format } from "date-fns";
  import nodeHtmlToBuffer from "node-html-to-image";

  const table = readFileSync("./src/html/table.html", "utf-8");
  // День недели
  const weekDay = [...];

  const createPhotoTable = async (rows, date) => {
    const trs = rows.map((row) => {
      const { startTime, endTime, subject, teachers, cabinet } = row;
      return createTr(
        startTime,
        endTime,
        subject?.name,
        teachers?.map((e) => e.fio)?.join(" | "),
        cabinet?.name || "Не указан",
      );
    });
    const content = table.replace("{CONTENT}", trs.join("\n"));
    const buffer = await nodeHtmlToBuffer({
      html: content,
      options: {
        format: "png",
      },
    });
    return {
      buffer,
      caption: `Расписание на ${format(date, "dd.MM.yy")} (${weekDay[date.getDay()]})`,
    };
  };

  const createTextTable = (rows, date) => {
    const table = [
      `┏━━━━━━━━━━━━━━━━━━━━━━\n┃ Дата:    ${format(date, "dd.MM.yy")} (${weekDay[date.getDay()]})\n┣━━━━━━━━━━━━━━━━━━━━━━`,
    ];
    rows.forEach((row, i) => {
      const { startTime, endTime, subject, teachers, cabinet } = row;
      table.push(`┃ ${startTime}    ${maxLength(subject?.name, 15)}`);
      table.push(`┃ ${endTime}    ${teachers?.map((e) => e.fio)?.join(" | ")}`);
      table.push(`┃ Каб.      ${cabinet?.name || "***Не указан***"}`);
      if (i != rows.length - 1) table.push("┣━━━━━━━━━━━━━━━━━━━━━━");
    });

    table.push("┗━━━━━━━━━━━━━━━━━━━━━━");

    return table.join("\n");
  };

  // Создание строк таблиц для createTextTable
  function createTr(startTime, endTime, lesson, teacher, cabinet) {
    if (lesson)
      return `<tr>
      <td class="time">
        <div>${startTime}</div>
        <div>${endTime}</div>
      </td>
      <td>
        <div class="row-lessons">
          <span>${lesson}</span>
          <span>${teacher}</span>
          <span>${cabinet}</span>
        </div>
      </td>
    </tr>`;
    else
      return `<tr>
      <td class="time">
        <div>${startTime}</div>
        <div>${endTime}</div>
      </td>
    </tr>`;
  }
  // Максимальная длина строки
  function maxLength(word, length) {
    if (word.length > length) return word.slice(0, length) + "...";
    return word;
  }

  export { createTextTable, createPhotoTable };
  ```

<br/>
<br/>

## Технологический Стек

- **Telegram API**: Используется библиотека `telegrafjs` для взаимодействия с Telegram API.
- **База данных**: В качестве базы данных используется `mongodb`.
- **Система кеширования**: Для кеширования данных применяется `redis`.

<br/>
<br/>

## Примечания

1. **API**: Слой взаимодействия с API упрощает процесс отправки запросов и обработки ответов, что делает код более читаемым и поддерживаемым.
2. **Обработчики команд**: Обработчики команд организованы в поддиректории для различных типов команд, что облегчает управление и расширение функциональности бота.
3. **Модели базы данных**: Модели MongoDB структурируют данные, хранящиеся в базе данных, обеспечивая эффективное извлечение и управление информацией пользователей.
4. **Главный исполняемый файл**: Файл `index.js` служит точкой входа для приложения, инициализируя бота и настраивая необходимые конфигурации.
5. **Структуры меню**: Структуры меню предоставляют способ представить опции и навигацию по различным разделам бота, улучшая пользовательский опыт.

<br/>
<br/>

Этот проект является открытым исходным кодом, и мы приветствуем вклад от сообщества. Если у вас есть предложения или вы обнаружили ошибку, пожалуйста, создайте issue или pull request.
