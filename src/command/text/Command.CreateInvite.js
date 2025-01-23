import Invite from "../../db/model/Invite.js";

import CommandClass from "./Command.Class.js";

import MenuMain from "../../menu/Menu.Main.js";

export default class CommandSelect extends CommandClass {
  constructor(props) {
    super(props);
  }

  async handle() {
    const text = this?.ctx?.update?.message?.text;
    const chatId = this?.ctx?.update?.message?.chat?.id;

    if (this.user.role != "admin") return;
    if (!text.startsWith("/invite")) return;

    const count = Number(text.split(" ")[1]) || 1; // default count = 1

    const invite = new Invite({
      creatorId: this.user.id,
      active: true,
      count: count,
    });

    invite
      .save()
      .then(() => {
        this.ctx.telegram
          .sendMessage(chatId, "✅ Инвайт создан", MenuMain)
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }
}
