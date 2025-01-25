import CommandClass from "./Command.Class.js";

import MenuSelectWeekDay from "../../menu/Menu.SelectWeekDay.js";

export default class CommandSelect extends CommandClass {
  isValidCommand() {
    return this.text === "🗓 Выбрать день недели";
  }

  async handle() {
    if (!this.isValidCommand()) return;

    this.ctx.telegram
      .sendMessage(
        this.chatId,
        "ℹ️ Меню\n\n✅ Выбор дня недели\n🔻 Выберите день недели снизу",
        MenuSelectWeekDay(),
      )
      .catch((err) => console.error(err));
  }
}
