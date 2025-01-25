import CommandClass from "./Command.Class.js";
import api from "../../api/api.js";
import sheets from "../../api/sheets.js";
import MenuMain from "../../menu/Menu.Main.js";
import { createTextTable, createPhotoTable } from "../../utils/createTable.js";

export default class CommandSelect extends CommandClass {
  isValidCommand() {
    return (
      this.text === "📋 Расписание на сегодня" ||
      this.text === "📋 Расписание на завтра"
    );
  }

  async handle() {
    if (!this.isValidCommand()) return;

    const lessons = await this.fetchLessons();
    if (!lessons) {
      await this.sendNoScheduleMessage("сегодня");
      return;
    }

    const currentDate = this.getSelectedDate();
    const todaysLessons = this.filterAndSortLessons(lessons, currentDate);

    if (todaysLessons.length === 0) {
      await this.sendNoScheduleMessage(this.getDayText());
      return;
    }

    await this.sendScheduleMessage(todaysLessons, currentDate);
  }

  async fetchLessons() {
    if (this.user?.mgok?.groupName) {
      return await sheets.lessons(
        this.user.mgok.groupName,
        this.user.mgok.course,
      );
    }
    return (await api.lessons(this.user.groupId)).lessons;
  }

  getSelectedDate() {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (this.text === "📋 Расписание на завтра") {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return currentDate;
  }

  getDayText() {
    return this.text === "📋 Расписание на завтра" ? "завтра" : "сегодня";
  }

  async sendNoScheduleMessage(day) {
    await this.ctx.telegram
      .sendMessage(
        this.chatId,
        `ℹ️ Информация\n\n❌ Нет расписания на ${day}`,
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
