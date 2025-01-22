import CommandClass from "./Command.Class.js";

import api from "../../api/api.js";
import MenuMain from "../../menu/Menu.Main.js";

const weekDays = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среду",
  "четверг",
  "пятницу",
  "субботу",
];

import createTextTable from "../../utils/createTextTable.js";

export default class CommandSelect extends CommandClass {
  async handle() {
    const selectWeekDayWord = this.text
      .replace("📋 Расписание на ", "")
      .split(" ")[0];

    if (!weekDays.includes(selectWeekDayWord)) return;

    const currentDate = new Date();
    const selectWeekDay = weekDays.indexOf(selectWeekDayWord) - 1;
    currentDate.setDate(currentDate.getDate() + selectWeekDay);

    const lessons = (await api.lessons(this.user.groupId)).lessons;

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
          `ℹ️ Информация\n\n❌ Нет расписания на ${selectWeekDayWord}`,
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
