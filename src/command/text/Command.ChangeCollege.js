import CommandClass from "./Command.Class.js";

import MenuSelectCollege from "../../menu/Menu.SelectCollege.js";

export default class CommandSelect extends CommandClass {
  isValidCommand() {
    return this.text === "⛪️ Изменить колледж";
  }

  async handle() {
    if (!this.isValidCommand()) return;

    this.ctx.telegram
      .sendMessage(
        this.chatId,
        "ℹ️ Редактирования\n\n✅ Изменения вашего колледжа\n🔻 Выберите колледж снизу",
        MenuSelectCollege,
      )
      .catch((err) => console.error(err));
  }
}
