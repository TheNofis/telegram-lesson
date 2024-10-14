import { Markup } from "telegraf";
import Api from "../api/api.js";

export default Api.groups().then((groups) => {
  const groupsList = chunkArray(
    groups.map((group) => {
      return `📚 ${group.name}`;
    }),
    2,
  );

  return Markup.keyboard(groupsList).oneTime().resize();
});

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
