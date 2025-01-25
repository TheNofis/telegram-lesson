import { readFileSync } from "fs";
import { format } from "date-fns";
import nodeHtmlToBuffer from "node-html-to-image";

const table = readFileSync("./src/html/table.html", "utf-8");
const weekDay = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const createPhotoTable = async (rows, date) => {
  const trs = rows
    .filter((e) => e?.subject?.name)
    .map((row) => {
      const { startTime, endTime, subject, teachers, cabinet } = row;
      return createTr(
        startTime,
        endTime,
        subject?.name,
        teachers?.map((e) => e.fio)?.join(" | "),
        cabinet?.name || "Не указан",
      );
    });
  const content = table.replace("{CONTENT}", trs.join("\n"));
  const buffer = await nodeHtmlToBuffer({
    html: content,
    options: {
      format: "png",
    },
  });
  return {
    buffer,
    caption: `Расписание на ${format(date, "dd.MM.yy")} (${weekDay[date.getDay()]})`,
  };
};

const createTextTable = (rows, date) => {
  const table = [
    `┏━━━━━━━━━━━━━━━━━━━━━━\n┃ Дата:    ${format(date, "dd.MM.yy")} (${weekDay[date.getDay()]})\n┣━━━━━━━━━━━━━━━━━━━━━━`,
  ];
  rows
    .filter((e) => e?.subject?.name)
    .forEach((row, i, rows) => {
      const { startTime, endTime, subject, teachers, cabinet } = row;
      table.push(
        `┃ ${startTime}    ${maxLength(subject?.name.replaceAll("\n", " "), 15)}`,
      );
      table.push(
        `┃ ${endTime}    ${teachers
          ?.map((e) => e.fio)
          ?.join(" | ")
          .replaceAll("\n", " ")}`,
      );
      table.push(
        `┃ Каб.      ${cabinet?.name.replaceAll("\n", " ") || "***Не указан***"}`,
      );
      if (i != rows.length - 1) table.push("┣━━━━━━━━━━━━━━━━━━━━━━");
    });

  table.push("┗━━━━━━━━━━━━━━━━━━━━━━");

  return table.join("\n");
};
// Создание строк таблиц для createTextTable
function createTr(startTime, endTime, lesson, teacher, cabinet) {
  if (lesson)
    return `<tr>
  <td class="time">
    <div>${startTime}</div>
    <div>${endTime}</div>
  </td>
  <td>
    <div class="row-lessons">
      <span>${lesson}</span>
      <span>${teacher}</span>
      <span>${cabinet}</span>
    </div>
  </td>
</tr>`;
  else
    return `<tr>
  <td class="time">
    <div>${startTime}</div>
    <div>${endTime}</div>
  </td>
</tr>`;
}
// Максимальная длина строки
function maxLength(word, length) {
  if (word.length > length) return word.slice(0, length) + "...";
  return word;
}

export { createTextTable, createPhotoTable };
