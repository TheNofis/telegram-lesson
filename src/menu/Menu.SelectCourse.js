import { Markup } from "telegraf";
export default Markup.keyboard([
  ["1️⃣ Курс", "2️⃣ Курс"],
  ["3️⃣ Курс", "4️⃣ Курс"],
])
  .oneTime()
  .resize();
