import Invite from "../../db/model/Invite.js";

import CommandClass from "./Command.Class.js";

import MenuMain from "../../menu/Menu.Main.js";

export default class CommandSelect extends CommandClass {
  isValidCommand() {
    return this.text.startsWith("/invite");
  }
  async handle() {
    if (!this.isValidCommand()) return;

    const count = Number(text.split(" ")[1]) || 1; // default count = 1

    const invite = new Invite({
      creatorId: this.user.id,
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
