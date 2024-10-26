import { Markup } from "telegraf";

const weekDays = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среду",
  "четверг",
  "пятницу",
  "субботу",
];

export default function SelectWeekDay() {
  const CurrentWeekDay = new Date().getDay();

  const menu = weekDays.map((day, index) => {
    return `📋 Расписание на ${day} ${CurrentWeekDay === index ? "(сегодня)" : ""}`;
  });
  // Сегодня в самом верху
  menu.unshift(...menu.splice(CurrentWeekDay));

  menu.push("↩️ Назад ↩️");
  return Markup.keyboard(menu).oneTime().resize();
}
