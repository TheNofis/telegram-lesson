import { eachDayOfInterval, parse, isSunday, startOfWeek } from "date-fns";
import googleSheets from "../db/connect/sheets.js";
import { getCachedData } from "../db/connect/redis.js";

const startDate = parse("14.01.25", "dd.MM.yy", new Date()); // -1 days
const spreadsheetId = "1XuDZVnfjl9cn4SGrqjA3CLgYyzyPNsQKI0xNNC48Aa4"; // ID вашей таблицы
const timeTable = [
  ["09:00", "10:30"],
  ["10:40", "12:10"],
  ["12:30", "14:00"],
  ["14:10", "15:40"],
  ["15:50", "17:20"],
  ["17:30", "19:00"],
];

async function getSheetData(spreadsheetId, range) {
  const response = await googleSheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  return response.data.values;
}

function numberToLetters(num) {
  let result = "";
  while (num > 0) {
    num--;
    result = String.fromCharCode((num % 26) + 65) + result;
    num = Math.floor(num / 26);
  }
  return result;
}

function calculateDaysWithoutSunday(startDate, endDate) {
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  const daysWithoutSunday = allDays.filter((day) => !isSunday(day));
  return daysWithoutSunday.length;
}

export default class {
  static async getSheetTabs() {
    return getCachedData("MCOURSES", async () => {
      const response = await googleSheets.spreadsheets.get({ spreadsheetId });
      return response.data.sheets
        .filter((sheet) => !sheet.properties.hidden)
        .map((sheet) => sheet.properties.title);
    });
  }
  static async groups(tab) {
    const key = tab ? `MGROUPS:${tab}` : "MGROUPS:ALL";
    return getCachedData(key, async () => {
      if (tab) {
        const groups =
          (await getSheetData(spreadsheetId, `'${tab}'!C5:AZ5`))[0] || [];
        return groups;
      }

      const allTabs = await this.getSheetTabs();
      const allGroups = (
        await Promise.all(
          allTabs.map((tab) => getSheetData(spreadsheetId, `'${tab}'!C5:AZ5`)),
        )
      ).flatMap((e) => e[0] || []);
      return allGroups;
    });
  }
  static async lessons(groupName, tab, date) {
    if (!date) date = new Date(startOfWeek(new Date(), { weekStartsOn: 1 }));

    const days = calculateDaysWithoutSunday(date, startDate);
    const allTabs = await this.getSheetTabs();
    const groups = await this.groups(allTabs[tab]);
    const groupId = groups.indexOf(groupName) + 4; // 4 is left padding
    const groupLetterId = numberToLetters(groupId);
    const startRow = 6 + days * 18;

    return getCachedData(`MSCHEDULE:${tab}:${groupName}:${days}`, async () =>
      (
        await getSheetData(
          spreadsheetId,
          `'${allTabs[tab]}'!${groupLetterId}${startRow}:${groupLetterId}${startRow + 17 + 18 * 5}`, // 17 - row in one week
        )
      )
        .map((e) => e[0] || "")
        .reduce((result, _, index, src) => {
          if (index % 3 === 0) {
            const [name = "", teachers = ""] = src[index].split("\n \n");
            const cabinet = src[index + 1]?.trim() || "";

            result.push({
              subject: {
                name: name.trim(),
              },
              teachers: [
                {
                  fio: teachers.trim(),
                },
              ],
              cabinet: {
                name: cabinet.trim(),
              },
            });
          }
          return result;
        }, [])

        .map((e, index) => {
          const lesson = index % 6;
          e.weekday = Math.floor(index / 6) + 1;
          e.lesson = lesson + 1;
          e.startTime = timeTable[lesson][0];
          e.endTime = timeTable[lesson][1];
          return e;
        }),
    );
  }
}
