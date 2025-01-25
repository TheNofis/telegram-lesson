import { Markup } from "telegraf";

const MenuSelectCourseNoBack = Markup.keyboard([
  ["1️⃣ Курс", "2️⃣ Курс"],
  ["3️⃣ Курс", "4️⃣ Курс"],
])
  .oneTime()
  .resize();

const MenuSelectCourseBack = JSON.parse(JSON.stringify(MenuSelectCourseNoBack));
MenuSelectCourseBack.reply_markup.keyboard.unshift(["↩️ Назад ↩️"]);

export default {
  MenuSelectCourseNoBack,
  MenuSelectCourseBack,
};
