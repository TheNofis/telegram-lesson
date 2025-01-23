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

import { createTextTable, createPhotoTable } from "../../utils/createTable.js";

export default class CommandSelect extends CommandClass {
  async handle() {
    const selectWeekDayWord = this.text
      .replace("📋 Расписание на ", "")
      .split(" ")[0];

    if (!weekDays.includes(selectWeekDayWord)) return;

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const selectedDayIndex = weekDays.indexOf(selectWeekDayWord);
    const currentDayIndex = currentDate.getDay();

    let daysToAdd = selectedDayIndex - currentDayIndex;
    if (daysToAdd < 0) daysToAdd += 7;
    currentDate.setDate(currentDate.getDate() + daysToAdd);

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

    const type = 1;

    if (type) {
      this.ctx.telegram.sendChatAction(this.chatId, "upload_photo");
      this.ctx.telegram
        .sendPhoto(
          this.chatId,
          {
            source: await createPhotoTable(getForCurrentDay, currentDate),
            parse_mode: "markdown",
          },
          {
            caption: "Hi! :3",
            parse_mode: "markdown",
            ...MenuMain,
          },
        )
        .catch(() => {
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
        });
    } else {
      this.ctx.telegram.sendChatAction(this.chatId, "typing");
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
}
