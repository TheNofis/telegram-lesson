import CommandClass from "./Command.Class.js";

import MenuMain from "../../menu/Menu.Main.js";

export default class CommandSelect extends CommandClass {
  constructor(props) {
    super(props);
  }

  async handle() {
    const text = this?.ctx?.update?.message?.text;
    const chatId = this?.ctx?.update?.message?.chat?.id;

    if (text != "👤 Профиль") return;

    this.ctx.telegram
      .sendMessage(
        chatId,
        `👤 Профиль\n\nℹ️ Имя: ${this.user.username}\n📚 Группа: ${this.user.groupName}\n\n✉️ Связаться: @thenofis\n🔗 GitHub: https://github.com/TheNofis/telegram-lesson`,
        MenuMain,
      )
      .catch((err) => console.error(err));
  }
}
