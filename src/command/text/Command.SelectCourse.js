import CommandClass from "./Command.Class.js";

import User from "../../db/model/User.js";
import MenuSelectMGOKGroup from "../../menu/Menu.SelectMGOKGroup.js";
import { redisClient } from "../../db/connect/redis.js";

const courses = ["1️⃣ Курс", "2️⃣ Курс", "3️⃣ Курс", "4️⃣ Курс"];
export default class CommandSelect extends CommandClass {
  isValidCommand() {
    return courses.includes(this.text);
  }

  async handle() {
    if (!this.isValidCommand()) return;

    const course = courses.indexOf(this.text);

    User.findOneAndUpdate(
      { telegramId: this.user.telegramId },
      {
        $set: {
          "mgok.course": course,
          "mgok.groupName": null,
        },
      },
      {
        new: true,
      },
    )
      .then(async (user) => {
        await redisClient
          .del(`user:${this.user.telegramId}`)
          .catch(console.error);

        this.ctx.telegram.sendMessage(
          this.chatId,
          `ℹ️ Редактирование\n\n🔻 Выберите вашу группу снизу`,
          await MenuSelectMGOKGroup.MenuSelectGroupNoBack(user?.mgok?.course),
        );
      })
      .catch((err) => {
        console.error(err);
        this.ctx.telegram.sendMessage(
          this.chatId,
          `❌ Ошибка\n\nℹ️ Не удалось выбрать курс`,
        );
      });
  }
}
