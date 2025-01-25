import CommandClass from "./Command.Class.js";

import MenuMain from "../../menu/Menu.Main.js";

export default class CommandSelect extends CommandClass {
  isValidCommand() {
    return this.text === "↩️ Назад ↩️";
  }
  async handle() {
    if (!this.isValidCommand()) return;

    this.ctx.telegram
      .sendMessage(this.chatId, "ℹ️ Главное меню", MenuMain)
      .catch((err) => console.error(err));
  }
}
