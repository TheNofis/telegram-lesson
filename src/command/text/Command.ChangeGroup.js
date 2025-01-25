import CommandClass from "./Command.Class.js";

import MenuSelectMGOKGroup from "../../menu/Menu.SelectMGOKGroup.js";
import MenuSelectHexletGroup from "../../menu/Menu.SelectGroup.js";

export default class CommandSelect extends CommandClass {
  isValidCommand() {
    return this.text === "📚 Группы";
  }

  async handle() {
    if (!this.isValidCommand()) return;

    const MgokMenu = this.user?.mgok
      ? MenuSelectMGOKGroup.MenuSelectGroupBack
      : null;
    const HexletMenu = this.user?.hexlet
      ? MenuSelectHexletGroup.MenuSelectGroupBack
      : null;

    this.ctx.telegram
      .sendMessage(
        this.chatId,
        "ℹ️ Редактирования\n\n✅ Изменения вашей группы\n🔻 Выберите вашу группу снизу",
        MgokMenu || HexletMenu,
      )
      .catch((err) => console.error(err));
  }
}
