import User from "../../db/model/User.js";

import CallbackChangeTable from "../callback/Callback.ChangeTable.js";

import { getCachedData } from "../../db/connect/redis.js";

export default class {
  constructor(bot) {
    this.bot = bot;
    this.user = null;
    this.initCommandList = [];
  }
  handle() {
    this.bot.on("callback_query", async (ctx) => {
      const chatId = ctx?.update?.callback_query?.message?.chat?.id;
      const userId = ctx?.update?.callback_query?.from?.id;

      // Cache
      this.user = await getCachedData(
        `user:${userId}`,
        async () => {
          return await User.findOne({ telegramId: userId });
        },
        600,
      );

      if (this.user == null)
        return ctx.telegram.sendMessage(
          chatId,
          `❌ Ошибка\n\nℹ️ Пользователь не зарегистрирован!`,
        );

      const payload = {
        bot: this.bot,
        user: this.user,
        ctx: ctx,
      };

      this.initCommandList = [new CallbackChangeTable(payload)];

      this.initCommandList.forEach((command) => command.handle());
    });
  }
}
