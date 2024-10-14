import { Markup } from "telegraf";
import Api from "../api/api.js";

const SelectGroupNoBack = await Api.groups().then((groups) => {
  Markup.keyboard(
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

const SelectGroupBack = JSON.parse(JSON.stringify(SelectGroupNoBack));
SelectGroupBack.reply_markup.keyboard.push(["↩️ Назад ↩️"]);

export default {
  SelectGroupNoBack,
  SelectGroupBack,
};

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
