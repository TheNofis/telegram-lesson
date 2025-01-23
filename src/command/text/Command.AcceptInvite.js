import Invite from "../../db/model/Invite.js";

import CommandClass from "./Command.Class.js";

import MenuMain from "../../menu/Menu.Main.js";
import User from "../../db/model/User.js";

export default class CommandSelect extends CommandClass {
  async handle() {
    if (!this.text.startsWith("/accept")) return;

    const uuid = text.split(" ")[1];
    const findInvite = await Invite.findOne({ invite: uuid });

    if (findInvite == null || !findInvite.active || findInvite.count < 1)
      return this.ctx.telegram.sendMessage(
        chatId,
        "Такого приглашения не найдено или оно не действительно",
        MenuMain,
      );

    // Update invite status
    Invite.findOneAndUpdate(
      { invite: uuid },
      {
        $set: {
          count: count - 1 > -1 ? count - 1 : 0,
          active: count - 1 > -1 ? true : false,
        },
      },
    ).catch((err) => console.error(err));

    // Update User
    User.findOneAndUpdate(
      { telegramId: this.user.telegramId },
      {
        $set: { admin: true },
      },
    )
      .then(() => {
        this.ctx.telegram
          .sendMessage(chatId, "✅ Вы приняли приглашение", MenuMain)
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }
}
