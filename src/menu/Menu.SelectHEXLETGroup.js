import { Markup } from "telegraf";
import Api from "../api/api.js";

const MenuSelectGroupNoBack = await Api.groups().then((groups) => {
  return Markup.keyboard(
    chunkArray(
      groups.map((group) => {
        return `📚 ${group.name}`;
      }),
      2,
    ),
  )
    .oneTime()
    .resize();
});

const MenuSelectGroupBack = JSON.parse(JSON.stringify(MenuSelectGroupNoBack));
MenuSelectGroupBack.reply_markup.keyboard.unshift(["↩️ Назад ↩️"]);

export default {
  MenuSelectGroupNoBack,
  MenuSelectGroupBack,
};

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
