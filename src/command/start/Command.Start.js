import User from "../../db/model/User.js";

import CommandClass from "./Command.Class.js";

import MenuSelectGroup from "../../menu/Menu.SelectGroup.js";

export default class CommandSelect extends CommandClass {
  async handle() {
    if (this.text != "/start") return;
    const findUser = await User.findOne({ telegramId: this.chatId });

    if (findUser == null) {
      // NEW USER
      const newUser = new User({
        username: this?.ctx?.update?.message?.from?.username || "<blank>",
        telegramId: this.userId,
      });
      newUser
        .save()
        .then(async () => {
          this.ctx.telegram
            .sendMessage(
              this.chatId,
              "ℹ️ Регистрация\n\n✅ Для удобной работы в боте надо зарегистрироваться!\n🔻 Выберите вашу группу снизу",
              MenuSelectGroup.MenuSelectGroupNoBack,
            )
            .catch((err) => console.error(err));
        })
        .catch((err) => {
          console.error(err);
          this.ctx.telegram.sendMessage(
            this.chatId,
            "❌ Ошибка регистрация\n\nℹ️ Не удалось зарегистрироваться!",
          );
        });
    }
  }
}
