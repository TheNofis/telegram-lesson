import CommandClass from "./Command.Class.js";

import api from "../../api/api.js";
import sheets from "../../api/sheets.js";
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
import { startOfWeek } from "date-fns";

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
    // const lessons = await sheets.lessons(
    //   "01.ПиОСО.23.ОФ.О.2",
    //   1,
    //   new Date(startOfWeek(currentDate, { weekStartsOn: 1 })),
    // );

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
    if (this?.user?.table) {
      this.ctx.telegram.sendChatAction(this.chatId, "upload_photo");
      const { buffer, caption } = await createPhotoTable(
        getForCurrentDay,
        currentDate,
      ).catch((err) => console.error(err));
      this.ctx.telegram
        .sendPhoto(
          this.chatId,
          {
            source: buffer,
            parse_mode: "markdown",
          },
          {
            caption: caption,
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
