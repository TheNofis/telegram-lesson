import { Markup } from "telegraf";
import Api from "../api/api.js";

export default async function (back) {
  const groupList = await Api.groups();
  const markup = Markup.keyboard(
    chunkArray(
      groupList.map((group) => {
        return `📚 ${group.name}`;
      }),
      2,
    ),
  )
    .oneTime()
    .resize();

  if (back) markup.push("↩️ Назад ↩️");
  return markup;
}

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
