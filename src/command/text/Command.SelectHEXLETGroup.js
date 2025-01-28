import CommandClass from "./Command.Class.js";
import Api from "../../api/api.js";

import MenuMain from "../../menu/Menu.Main.js";
import User from "../../db/model/User.js";
import { redisClient } from "../../db/connect/redis.js";

export default class CommandSelect extends CommandClass {
  isValidCommand() {
    return this.text.startsWith("📚") && this.text !== "📚 Группы";
  }

  async handle() {
    if (!this.isValidCommand()) return;

    const content = this.text.split(" ");

    if (content[0] != "📚") return;
    const getGroupList = await Api.groups();

    const findGroup =
      getGroupList.find((group) => {
        return group.name == content[1];
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
          "hexlet.groupName": content[1],
          "hexlet.groupId": findGroup.id || "",
        },
        $unset: {
          mgok: null,
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
