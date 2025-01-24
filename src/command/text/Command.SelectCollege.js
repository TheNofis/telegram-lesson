import CommandClass from "./Command.Class.js";

import MenuSelectCourse from "../../menu/Menu.SelectCourse.js";
import MenuSelectHexletGroup from "../../menu/Menu.SelectGroup.js";

export default class CommandSelect extends CommandClass {
  async handle() {
    if (this.text === "МГОК") {
      this.ctx.telegram
        .sendMessage(
          this.chatId,
          "Вы выбрали МГОК!\n\n Выберите курс",
          MenuSelectCourse,
        )
        .catch((err) => console.error(err));
    }
    if (this.text === "Хекслет") {
      this.ctx.telegram
        .sendMessage(
          this.chatId,
          "Вы выбрали Хекслет!\n\n ℹ️ Регистрация\n\n✅ Для удобной работы в боте надо зарегистрироваться!\n🔻 Выберите вашу группу снизу",
          MenuSelectHexletGroup.MenuSelectGroupNoBack,
        )
        .catch((err) => console.error(err));
    }
  }
}
