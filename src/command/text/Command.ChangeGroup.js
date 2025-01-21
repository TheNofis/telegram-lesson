import CommandClass from "./Command.Class.js";

import MenuSelectGroup from "../../menu/Menu.SelectGroup.js";

export default class CommandSelect extends CommandClass {
  async handle() {
    if (this.text != "📚 Группы") return;

    this.ctx.telegram
      .sendMessage(
        this.chatId,
        "ℹ️ Редактирования\n\n✅ Изменения вашей группы\n🔻 Выберите вашу группу снизу",
        MenuSelectGroup.MenuSelectGroupBack,
      )
      .catch((err) => console.error(err));
  }
}
