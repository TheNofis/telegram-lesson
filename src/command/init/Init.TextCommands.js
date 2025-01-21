import User from "../../db/model/User.js";

import CommandSelectGroup from "../text/Command.SelectGroup.js";
import CommandProfile from "../text/Command.Profile.js";

import CommandChangeGroup from "../text/Command.ChangeGroup.js";
import CommandMainMenu from "../text/Command.MainMenu.js";
import CommandSchedule from "../text/Command.Schedule.js";
import CommandSelectWeekDay from "../text/Comamnd.SelectWeekDay.js";
import CommandScheduleForWeekDay from "../text/Command.ScheduleForWeekDay.js";

import redisClient from "../../db/connect/redis.js";

export default class {
  constructor(bot) {
    this.bot = bot;
    this.user = null;
    this.initCommandList = [];
  }
  handle() {
    this.bot.on("text", async (ctx) => {
      const chatId = ctx?.update?.message?.chat?.id;
      const userId = ctx?.update?.message?.from?.id;

      // Cache
      const cacheUser = await redisClient.get(`user:${userId}`);
      if (cacheUser !== "null") this.user = JSON.parse(cacheUser);
      else {
        this.user = await User.findOne({ telegramId: userId });
        redisClient
          .set(`user:${userId}`, JSON.stringify(this.user), { EX: 600 })
          .catch((err) => console.error(`TextCommad.Init.js: ${err}`));
      }

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

      this.initCommandList = [
        new CommandSelectGroup(payload),
        new CommandProfile(payload),
        new CommandChangeGroup(payload),
        new CommandMainMenu(payload),
        new CommandSchedule(payload),
        new CommandSelectWeekDay(payload),
        new CommandScheduleForWeekDay(payload),
      ];

      this.initCommandList.forEach((command) => command.handle());
    });
  }
}
