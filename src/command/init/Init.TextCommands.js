import User from "../../db/model/User.js";

import CommandSelectGroup from "../text/Command.SelectGroup.js";
import CommandProfile from "../text/Command.Profile.js";

import CommandChangeGroup from "../text/Command.ChangeGroup.js";
import CommandMainMenu from "../text/Command.MainMenu.js";
import CommandSchedule from "../text/Command.Schedule.js";
import CommandSelectWeekDay from "../text/Comamnd.SelectWeekDay.js";
import CommandScheduleForWeekDay from "../text/Command.ScheduleForWeekDay.js";

export default class {
  constructor(bot) {
    this.bot = bot;
    this.initCommandList = [];
  }
  handle() {
    this.bot.on("text", async (ctx) => {
      const chatId = ctx?.update?.message?.chat?.id;
      const findUser = await User.findOne({
        telegramId: chatId,
      });
      if (findUser == null)
        return ctx.telegram.sendMessage(
          chatId,
          `❌ Ошибка\n\nℹ️ Пользователь не зарегистрирован!`,
        );

      const payload = {
        bot: this.bot,
        ctx: ctx,
        user: findUser,
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
