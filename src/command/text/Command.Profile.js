import CommandClass from "./Command.Class.js";

import MenuMain from "../../menu/Menu.Main.js";

export default class CommandSelect extends CommandClass {
  async handle() {
    if (this.text != "👤 Профиль") return;

    const groupname =
      this.user?.mgok?.groupName ||
      this.user?.hexlet?.groupName ||
      "Не выбрана";
    const college = this.user?.hexlet?.groupId ? "Hexlet" : "МГОК";
    const course =
      college == "МГОК" ? `🎓 Курс: ${this.user?.mgok?.course}\n` : "";

    this.ctx.telegram
      .sendMessage(
        this.chatId,
        `👤 Профиль\n\nℹ️ Имя: ${this.user.username}\n🏫 Колледж: ${college}\n${course}📚 Группа: ${groupname}\n\n✉️ Связаться: @thenofis\n🔗 GitHub: https://github.com/TheNofis/telegram-lesson`,
        MenuMain,
      )
      .catch((err) => console.error(err));
  }
}
