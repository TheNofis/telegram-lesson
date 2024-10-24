import CommandClass from "./Command.Class.js";

import MenuMain from "../../menu/Menu.Main.js";

export default class CommandSelect extends CommandClass {
  constructor(props) {
    super(props);
  }
  async handle() {
    const text = this?.ctx?.update?.message?.text;
    const chatId = this?.ctx?.update?.message?.chat?.id;

    if (text != "↩️ Назад ↩️") return;

    this.ctx.telegram.sendMessage(chatId, "ℹ️ Главное меню", MenuMain);
  }
}
