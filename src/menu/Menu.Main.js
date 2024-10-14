import { Markup } from "telegraf";
export default Markup.keyboard([
  ["📋 Расписание на сегодня"],
  ["📋 Расписание на завтра"],
  ["👤 Профиль", "📚 Группы"],
])
  .oneTime()
  .resize();
