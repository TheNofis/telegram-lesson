import CommandClass from "./Command.Class.js";

import MenuSelectCourse from "../../menu/Menu.SelectCourse.js";
import MenuSelectHexletGroup from "../../menu/Menu.SelectHEXLETGroup.js";

export default class CommandSelect extends CommandClass {
  isValidCommand() {
    return this.text === "📚 Группы";
  }

  async handle() {
    if (!this.isValidCommand()) return;

    let menu;
    let message;

    if (this.user?.hexlet) {
      menu = MenuSelectHexletGroup.MenuSelectGroupBack;
      message =
        "ℹ️ Редактирования\n\n✅ Изменения вашей группы\n🔻 Выберите вашу группу снизу";
    } else if (this.user?.mgok) {
      menu = MenuSelectCourse.MenuSelectCourseBack;
      message =
        "ℹ️ Редактирования\n\n✅ Изменения вашего курса\n🔻 Выберите курс снизу";
    }

    this.ctx.telegram
      .sendMessage(this.chatId, message, menu)
      .catch((err) => console.error(err));
  }
}
