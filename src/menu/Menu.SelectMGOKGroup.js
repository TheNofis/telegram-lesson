import { Markup } from "telegraf";
import Api from "../api/sheets.js";

export default class {
  static async MenuSelectGroupNoBack(tab) {
    const getCourseName = (await Api.getSheetTabs())[tab];
    const getGroupList = await Api.groups(getCourseName);

    return Markup.keyboard(
      chunkArray(
        getGroupList.map((group) => {
          return `📕 ${group}`;
        }),
        2,
      ),
    )
      .oneTime()
      .resize();
  }
  static async MenuSelectGroupBack(tab) {
    const output = await this.MenuSelectGroupNoBack(tab);
    output.reply_markup.keyboard.unshift(["↩️ Назад ↩️"]);
    return output;
  }
}

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
