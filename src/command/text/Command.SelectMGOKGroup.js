import CommandClass from "./Command.Class.js";
import Api from "../../api/sheets.js";

import MenuMain from "../../menu/Menu.Main.js";
import User from "../../db/model/User.js";
import { redisClient } from "../../db/connect/redis.js";

export default class CommandSelect extends CommandClass {
  isValidCommand() {
    return this.text.startsWith("📕") && this.text !== "📕 Группы";
  }
  async handle() {
    if (!this.isValidCommand()) return;

    const content = this.text.split(" ");
    const getCourseName = (await Api.getSheetTabs())[this?.user?.mgok?.course];

    const getGroupList = await Api.groups(getCourseName);

    const findGroup =
      getGroupList.find((group) => {
        return group == content[1];
      }) || null;

    if (findGroup == null)
      return this.ctx.telegram
        .sendMessage(
          this.chatId,
          `❌ Ошибка\n\nℹ️ Группа ${content[1]} не найдена!`,
        )
        .catch((err) => console.error(err));
    User.findOneAndUpdate(
      { telegramId: this.user.telegramId },
      {
        $set: {
          "mgok.groupName": content[1],
        },
      },
    )
      .then(() => {
        redisClient
          .del(`user:${this.user.telegramId}`)
          .then(() => {
            this.ctx.telegram
              .sendMessage(
                this.chatId,
                `✅ Группа ${content[1]} успешно выбрана!`,
                MenuMain,
              )
              .catch((err) => {
                console.error(err);
                this.ctx.telegram.sendMessage(
                  this.chatId,
                  `❌ Ошибка\n\nℹ️ Не удалось сохранить группу`,
                );
              });
          })
          .catch((err) => {
            console.error(err);
            this.ctx.telegram.sendMessage(
              this.chatId,
              `❌ Ошибка\n\nℹ️ Не удалось сохранить группу`,
            );
          });
      })
      .catch((err) => {
        console.error(err);
        this.ctx.telegram.sendMessage(
          this.chatId,
          `❌ Ошибка\n\nℹ️ Не удалось сохранить группу`,
        );
      });
  }
}
