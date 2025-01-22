import { format } from "date-fns";

const weekDay = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

export default function renderTextTable(rows, date) {
  const table = [
    `┏━━━━━━━━━━━━━━━━━━━━━━\n┃ Дата:    ${format(date, "dd.MM.yy")} (${weekDay[date.getDay()]})\n┣━━━━━━━━━━━━━━━━━━━━━━`,
  ];
  rows.forEach((row, i) => {
    table.push(`┃ ${row.startTime}    ${maxLength(row?.subject?.name, 15)}`);
    table.push(
      `┃ ${row.endTime}    ${row?.teachers?.map((e) => e.fio)?.join(" | ")}`,
    );
    table.push(`┃ Каб.      ${row?.cabinet?.name || "***Не указан***"}`);
    if (i != rows.length - 1) table.push("┣━━━━━━━━━━━━━━━━━━━━━━");
  });

  table.push("┗━━━━━━━━━━━━━━━━━━━━━━");

  return table.join("\n");
}

function maxLength(word, length) {
  if (word.length > length) return word.slice(0, length) + "...";
  return word;
}
