import { Markup } from "telegraf";
export default Markup.inlineKeyboard([
  Markup.button.callback("Изменить отображение таблицы", "changeTable"),
]);
