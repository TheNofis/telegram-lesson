import CommandClass from "./Command.Class.js";

import MenuSelectGroup from "../../menu/Menu.SelectGroup.js";

export default class CommandSelect extends CommandClass {
  constructor(props) {
    super(props);
  }

  async handle() {
    const text = this?.ctx?.update?.message?.text;
    const chatId = this?.ctx?.update?.message?.chat?.id;

    if (text != "📚 Группы") return;

    this.ctx.telegram
      .sendMessage(
        chatId,
        "ℹ️ Редактирования\n\n✅ Изменения вашей группы\n🔻 Выберите вашу группу снизу",
        MenuSelectGroup.MenuSelectGroupBack,
      )
      .catch((err) => console.error(err));
  }
}
