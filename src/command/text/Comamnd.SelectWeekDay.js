import CommandClass from "./Command.Class.js";

import MenuSelectWeekDay from "../../menu/Menu.SelectWeekDay.js";

export default class CommandSelect extends CommandClass {
  constructor(props) {
    super(props);
  }

  async handle() {
    const text = this?.ctx?.update?.message?.text;
    const chatId = this?.ctx?.update?.message?.chat?.id;

    if (text != "🗓 Выбрать день недели") return;

    this.ctx.telegram
      .sendMessage(
        chatId,
        "ℹ️ Меню\n\n✅ Выбор дня недели\n🔻 Выберите день недели снизу",
        MenuSelectWeekDay(),
      )
      .catch((err) => console.error(err));
  }
}
