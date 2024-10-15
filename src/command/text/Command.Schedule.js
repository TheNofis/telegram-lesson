import api from "../../api/api.js";
import MenuMain from "../../menu/Menu.Main.js";

export default class CommandSelect {
  constructor(props) {
    this.bot = props.bot;
    this.ctx = props.ctx;
    this.user = props.user;
  }
  async handle() {
    const text = this?.ctx?.update?.message?.text;
    const chatId = this?.ctx?.update?.message?.chat?.id;

    if (
      !(text == "📋 Расписание на сегодня" || text == "📋 Расписание на завтра")
    )
      return;
    const lessons = (await api.lessons(this.user.groupId)).lessons;

    const currentDate = new Date();
    if (text == "📋 Расписание на завтра")
      currentDate.setDate(currentDate.getDate() + 1);

    const getForCurrentDay = lessons
      .filter((lesson) => {
        if (lesson.weekday == currentDate.getDay()) return lesson;
      })
      .sort((a, b) => {
        if (a.lesson > b.lesson) return 1;
        if (a.lesson < b.lesson) return -1;
        return 0;
      });
    if (getForCurrentDay.length == 0) {
      return this.ctx.telegram.sendMessage(
        chatId,
        text == "📋 Расписание на завтра"
          ? "ℹ️ Информация\n\n❌ Нет расписания на завтра"
          : "ℹ️ Информация\n\n❌ Нет расписания на сегодня",
        MenuMain,
      );
    }

    this.ctx.telegram.sendMessage(
      chatId,
      renderTable(getForCurrentDay),
      MenuMain,
    );
  }
}

function renderTable(rows) {
  const table = ["┏━━━━━━━━━━━━━━━━━━━━━━"];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    table.push(`┃ ${row.startTime}    ${maxLength(row?.subject?.name, 15)}`);
    table.push(
      `┃ ${row.endTime}    ${row?.teachers?.map((e) => e.fio)?.join(" | ")}`,
    );
    table.push(`┃ Каб.      ${row?.cabinet?.name}`);
    if (i != rows.length - 1) table.push("┣━━━━━━━━━━━━━━━━━━━━━━");
  }

  table.push("┗━━━━━━━━━━━━━━━━━━━━━━");

  return table.join("\n");
}

function maxLength(word, length) {
  if (word.length > length) return word.slice(0, length) + "...";
  return word;
}
