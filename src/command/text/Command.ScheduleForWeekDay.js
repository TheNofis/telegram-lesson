import CommandClass from "./Command.Class.js";
import api from "../../api/api.js";
import sheets from "../../api/sheets.js";
import MenuMain from "../../menu/Menu.Main.js";
import { createTextTable, createPhotoTable } from "../../utils/createTable.js";
import { startOfWeek } from "date-fns";

const weekDays = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среду",
  "четверг",
  "пятницу",
  "субботу",
];

export default class CommandSelect extends CommandClass {
  async handle() {
    const selectedDay = this.extractSelectedDay();
    if (!selectedDay) return;

    const currentDate = this.getSelectedDate(selectedDay);
    const lessons = await this.fetchLessons(currentDate);

    if (!lessons) {
      await this.sendNoScheduleMessage(selectedDay);
      return;
    }

    const todaysLessons = this.filterAndSortLessons(lessons, currentDate);
    if (todaysLessons.length === 0) {
      await this.sendNoScheduleMessage(selectedDay);
      return;
    }

    await this.sendScheduleMessage(todaysLessons, currentDate);
  }

  extractSelectedDay() {
    const selectWeekDayWord = this.text
      .replace("📋 Расписание на ", "")
      .split(" ")[0];

    return weekDays.includes(selectWeekDayWord) ? selectWeekDayWord : null;
  }

  getSelectedDate(selectedDay) {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const selectedDayIndex = weekDays.indexOf(selectedDay);
    const currentDayIndex = currentDate.getDay();

    let daysToAdd = selectedDayIndex - currentDayIndex;
    if (daysToAdd < 0) daysToAdd += 7;
    currentDate.setDate(currentDate.getDate() + daysToAdd);

    return currentDate;
  }

  async fetchLessons(currentDate) {
    if (this.user?.mgok?.groupName) {
      return await sheets.lessons(
        this.user.mgok.groupName,
        this.user.mgok.course,
        new Date(startOfWeek(currentDate, { weekStartsOn: 1 })),
      );
    }
    return (
      await api.lessons(
        this.user?.hexlet?.groupId,
        new Date(startOfWeek(currentDate, { weekStartsOn: 1 })),
      )
    ).lessons;
  }

  async sendNoScheduleMessage(selectedDay) {
    await this.ctx.telegram
      .sendMessage(
        this.chatId,
        `ℹ️ Информация\n\n❌ Нет расписания на ${selectedDay}`,
        MenuMain,
      )
      .catch((err) => console.error(err));
  }

  filterAndSortLessons(lessons, currentDate) {
    return lessons
      .filter((lesson) => lesson.weekday === currentDate.getDay())
      .sort((a, b) => a.lesson - b.lesson);
  }

  async sendScheduleMessage(todaysLessons, currentDate) {
    if (this.user?.table) {
      await this.sendPhotoSchedule(todaysLessons, currentDate);
    } else {
      await this.sendTextSchedule(todaysLessons, currentDate);
    }
  }

  async sendPhotoSchedule(todaysLessons, currentDate) {
    this.ctx.telegram.sendChatAction(this.chatId, "upload_photo");
    try {
      const { buffer, caption } = await createPhotoTable(
        todaysLessons,
        currentDate,
      );
      await this.ctx.telegram.sendPhoto(
        this.chatId,
        { source: buffer, parse_mode: "markdown" },
        { caption, parse_mode: "markdown", ...MenuMain },
      );
    } catch (err) {
      console.error(err);
      await this.sendTextSchedule(todaysLessons, currentDate);
    }
  }

  async sendTextSchedule(todaysLessons, currentDate) {
    this.ctx.telegram.sendChatAction(this.chatId, "typing");
    await this.ctx.telegram
      .sendMessage(this.chatId, createTextTable(todaysLessons, currentDate), {
        parse_mode: "markdown",
        ...MenuMain,
      })
      .catch((err) => console.error(err));
  }
}
