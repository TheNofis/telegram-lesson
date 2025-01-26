import CommandClass from "./Command.Class.js";

import MenuSelectCourse from "../../menu/Menu.SelectCourse.js";
import MenuSelectHexletGroup from "../../menu/Menu.SelectHEXLETGroup.js";

export default class CommandSelect extends CommandClass {
  isValidCommand() {
    return this.text === "🏫 МГОК" || this.text === "🏫 Хекслет";
  }

  async handle() {
    if (!this.isValidCommand()) return;

    if (this.text === "🏫 МГОК") {
      this.ctx.telegram
        .sendMessage(
          this.chatId,
          "ℹ️ Регистрация\n\n✅ Для удобной работы в боте надо зарегистрироваться!\n🔻 Выберите ваш курс снизу",
          MenuSelectCourse.MenuSelectCourseNoBack,
        )
        .catch((err) => console.error(err));
    }
    if (this.text === "🏫 Хекслет") {
      this.ctx.telegram
        .sendMessage(
          this.chatId,
          "ℹ️ Регистрация\n\n✅ Для удобной работы в боте надо зарегистрироваться!\n🔻 Выберите вашу группу снизу",
          MenuSelectHexletGroup.MenuSelectGroupNoBack,
        )
        .catch((err) => console.error(err));
    }
  }
}
