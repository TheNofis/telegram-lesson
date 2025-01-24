import { Markup } from "telegraf";
export default Markup.keyboard([
  ["Первый", "Второй"],
  ["Третий", "Четвертый"],
])
  .oneTime()
  .resize();
