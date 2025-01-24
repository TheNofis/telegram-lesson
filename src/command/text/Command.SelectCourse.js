import CommandClass from "./Command.Class.js";

import User from "../../db/model/User.js";
import MenuSelectMGOKGroup from "../../menu/Menu.SelectMGOKGroup.js";

const courses = ["Первый", "Второй", "Третий", "Четвертый"];

export default class CommandSelect extends CommandClass {
  async handle() {
    if (!courses.includes(this.text.trim())) return;

    const course = courses.indexOf(this.text);

    User.findOneAndUpdate(
      { telegramId: this.user.telegramId },
      {
        $set: {
          "mgok.course": course,
        },
      },
    )
      .then(() => {
        this.ctx.telegram.sendMessage(
          this.chatId,
          `✅ Курс ${this.text} успешно выбран!\n\n ℹ️ Регистрация\n\n✅ Для удобной работы в боте надо зарегистрироваться!\n🔻 Выберите вашу группу снизу`,
          MenuSelectMGOKGroup.MenuSelectGroupNoBack,
        );
      })
      .catch((err) => {
        console.error(err);
        this.ctx.telegram.sendMessage(
          this.chatId,
          `❌ Ошибка\n\nℹ️ Не удалось выбрать курс`,
        );
      });
  }
}
