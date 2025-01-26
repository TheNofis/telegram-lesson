import { Markup } from "telegraf";
export default Markup.keyboard([
  ["📋 Расписание на сегодня"],
  ["📋 Расписание на завтра"],
  ["🗓 Выбрать день недели"],
  ["👤 Профиль", "📚 Группы"],
  ["⛪️ Изменить колледж"],
])
  .oneTime()
  .resize();
