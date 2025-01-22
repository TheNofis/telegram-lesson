import CommandClass from "./Command.Class.js";

import api from "../../api/api.js";
import MenuMain from "../../menu/Menu.Main.js";

import createTextTable from "../../utils/createTextTable.js";

export default class CommandSelect extends CommandClass {
  async handle() {
    if (
      !(
        this.text == "📋 Расписание на сегодня" ||
        this.text == "📋 Расписание на завтра"
      )
    )
      return;

    const lessons = (await api.lessons(this.user.groupId)).lessons;
    const currentDate = new Date();

    if (this.text == "📋 Расписание на завтра")
      currentDate.setDate(currentDate.getDate() + 1);

    const getForCurrentDay = lessons
      .filter((lesson) => lesson.weekday == currentDate.getDay())
      .sort((a, b) => {
        if (a.lesson > b.lesson) return 1;
        if (a.lesson < b.lesson) return -1;
        return 0;
      });

    if (getForCurrentDay.length == 0)
      return this.ctx.telegram
        .sendMessage(
          this.chatId,
          this.text == "📋 Расписание на завтра"
            ? "ℹ️ Информация\n\n❌ Нет расписания на завтра"
            : "ℹ️ Информация\n\n❌ Нет расписания на сегодня",
          MenuMain,
        )
        .catch((err) => console.error(err));

    this.ctx.telegram
      .sendMessage(
        this.chatId,
        createTextTable(getForCurrentDay, currentDate),
        {
          parse_mode: "markdown",
          ...MenuMain,
        },
      )
      .catch((err) => console.error(err));
  }
}
