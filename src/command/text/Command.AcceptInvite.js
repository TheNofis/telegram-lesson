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

    if (!text.startsWith("/accept")) return;

    const uuid = text.split(" ")[1];
    const findInvite = await Invite.findOne({ invite: uuid });

    if (findInvite == null || !findInvite.active || findInvite.count < 1) {
      this.ctx.telegram.sendMessage(
        chatId,
        "Такого приглашения не найдено или оно не действительно",
        MenuMain,
      );
      return;
    }

    findInvite.count--;
    if (findInvite.count < 1) findInvite.active = false;
    findInvite.save().catch((err) => console.error(err));

    this.user.role = "admin";
    this.user
      .save()
      .then(() => {
        this.ctx.telegram
          .sendMessage(chatId, "✅ Вы приняли приглашение", MenuMain)
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }
}
