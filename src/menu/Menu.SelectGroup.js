import { Markup } from "telegraf";
import Api from "../api/api.js";

export default async function (back) {
  const groupList = await Api.groups();
  const chunked = chunkArray(
    groupList.map((group) => {
      return `📚 ${group.name}`;
    }),
    2,
  );
  if (back) chunked.push("↩️ Назад ↩️");
  return Markup.keyboard(chunked).oneTime().resize();
}

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
