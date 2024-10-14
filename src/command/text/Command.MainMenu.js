import MenuMain from "../../menu/Menu.Main.js";

export default class CommandSelect {
  constructor(props) {
    this.bot = props.bot;
    this.ctx = props.ctx;
    this.user = props.user;
  }
  async handle() {
    const text = this?.ctx?.update?.message?.text;
    const chatId = this?.ctx?.update?.message?.chat?.id;

    if (text != "↩️ Назад ↩️") return;

    this.ctx.telegram.sendMessage(chatId, "ℹ️ Главное меню", MenuMain);
  }
}
