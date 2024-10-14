import User from "../../db/model/User.js";

import MenuSelectGroup from "../../menu/Menu.SelectGroup.js";

export default class CommandSelect {
  constructor(bot, ctx) {
    this.bot = bot;
    this.ctx = ctx;
  }
  async handle() {
    const text = this?.ctx?.update?.message?.text;
    const chatId = this?.ctx?.update?.message?.chat?.id;

    if (text != "/start") return;

    const findUser = await User.findOne({ telegramId: chatId });

    if (findUser == null) {
      // NEW USER
      const newUser = new User({
        username: this?.ctx?.update?.message?.from?.username,
        telegramId: chatId,
      });
      newUser
        .save()
        .then(async () => {
          this.ctx.telegram.sendMessage(
            chatId,
            "ℹ️ Регистрация\n\n✅ Для удобной работы в боте надо зарегистрироваться!\n🔻 Выберите вашу группу снизу",
            await MenuSelectGroup(false),
          );
        })
        .catch(() => {
          this.ctx.telegram.sendMessage(
            chatId,
            "❌ Ошибка регистрация\n\nℹ️ Не удалось зарегистрироваться!",
          );
        });
    }
  }
}
