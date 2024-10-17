import CommandClass from "../Command.Class.js";
import Api from "../../api/api.js";

import MenuMain from "../../menu/Menu.Main.js";

export default class CommandSelect extends CommandClass {
  constructor(props) {
    super(props);
  }
  async handle() {
    const text = this?.ctx?.update?.message?.text;
    const chatId = this?.ctx?.update?.message?.chat?.id;

    const content = text.split(" ");
    if (text == "📚 Группы") return;
    if (content[0] != "📚") return;
    const getGroupList = await Api.groups();

    const findGroup =
      getGroupList.find((group) => {
        return group.name == content[1];
      }) || null;

    if (findGroup == null)
      return this.ctx.telegram.sendMessage(
        chatId,
        `❌ Ошибка\n\nℹ️ Группа ${content[1]} не найдена!`,
      );

    this.user.groupId = findGroup.id;
    this.user.groupName = findGroup.name;
    this.user
      .save()
      .then(() => {
        this.ctx.telegram.sendMessage(
          chatId,
          `✅ Группа ${content[1]} успешно выбрана!`,
          MenuMain,
        );
      })
      .catch(() => {
        this.ctx.telegram.sendMessage(
          chatId,
          `❌ Ошибка\n\nℹ️ Не удалось сохранить группу`,
        );
      });
  }
}
