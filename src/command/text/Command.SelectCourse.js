import CommandClass from "./Command.Class.js";

import User from "../../db/model/User.js";
import MenuSelectMGOKGroup from "../../menu/Menu.SelectMGOKGroup.js";
import { redisClient } from "../../db/connect/redis.js";

const courses = ["1️⃣ Курс", "2️⃣ Курс", "3️⃣ Курс", "4️⃣ Курс"];
export default class CommandSelect extends CommandClass {
  async handle() {
    if (!courses.includes(this.text)) return;

    const course = courses.indexOf(this.text);

    User.findOneAndUpdate(
      { telegramId: this.user.telegramId },
      {
        $set: {
          "mgok.course": course,
          "mgok.groupName": null,
        },
      },
    )
      .then(() => {
        redisClient
          .del(this.user.telegramId)
          .then(async () => {
            this.ctx.telegram.sendMessage(
              this.chatId,
              `ℹ️ Регистрация\n\n🔻 Выберите вашу группу снизу`,
              await MenuSelectMGOKGroup.MenuSelectGroupNoBack(
                this?.user?.mgok?.course,
              ),
            );
          })
          .catch(console.error);
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
