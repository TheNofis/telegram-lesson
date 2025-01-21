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

Для запуска проекта необходимо отредактировать файл `.env.example`, вставить в него ваши данные и переименовать его в `.env`. В этом файле укажите следующие переменные:

- `BOT_TOKEN`: Токен вашего Telegram бота.
- `MONGODB_URI`: URI вашей MongoDB базы данных.

После этого используйте команду `npm run start` для запуска проекта или `npm run dev` для разработки.

<br/>
<br/>

## Структура Проекта

Проект организован в несколько ключевых директорий и файлов, каждый из которых выполняет определенную функцию:

- **api**: Содержит слой взаимодействия с API для общения с API расписания колледжа.
- **command**: Хранит обработчики команд для различных команд бота.
  - **init**: Инициализирует обработчики команд.
  - **start**: Содержит логику для команды `/start`.
  - **text**: Содержит логику для текстовых команд.
- **db**: Определяет модели MongoDB, используемые ботом.
- **index.js**: Главный исполняемый файл.
- **menu**: Содержит структуры меню для бота.

<br/>
<br/>

## Ключевые Компоненты

### 1. Слой Взаимодействия с API

Директория `api` содержит файлы, которые отвечают за связь с внешними сервисами

- **redis.js**: Файл нужный для создания подключения к redis, для последующего переиспользования соединения и кеширования данных

  ```javascript
  // Пример redis.js

  // Да...
  ```

- **api.js**: Файл который служит прослойкой для удобного взаимодействия с API расписания колледжа. Этот слой упрощает процесс отправки запросов к API и обработки ответов.

  ```javascript
  // Пример api.js

  // Подключение к Redis
  const redisClient = ...

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

### 4. Главный Исполняемый Файл

Файл `index.js` является главным исполняемым файлом. Он служит точкой входа для приложения, инициализируя бота и настраивая необходимые конфигурации.

```javascript
// Пример index.js

// Импорт инициализаторов обработчиков
import InitExampleCommand from "./command/init/Init.ExampleCommand.js";

// Класс бота
class Bot {
  constructor(props) {
    this.bot = {...};
    this.initCommandList = [...];
    this.mongoDBUrl = ...;
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

### 5. Структуры Меню

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

Этот проект является открытым исходным кодом, и мы приветствуем вклад от сообщества. Если у вас есть предложения или вы обнаружили ошибку, пожалуйста, создайте issue или pull request.
