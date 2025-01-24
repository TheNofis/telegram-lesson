import fetch from "node-fetch";
import { format, startOfWeek } from "date-fns";

import { getCachedData } from "../db/connect/redis.js";

const publicationId = "cdb2a14c-a891-4f9f-b56c-7e8eb559c766";
const baseUrl = "https://schedule.mstimetables.ru/api/publications";

async function get(url) {
  return fetch(`${baseUrl}/${url}`)
    .then((res) => res.json())
    .then((json) => json)
    .catch((err) => console.error(`API Error: ${err}`));
}

async function post({ url, data }) {
  return fetch(`${baseUrl}/${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((json) => json)
    .catch((err) => console.error(`API Error: ${err}`));
}

export default class {
  static async groups() {
    return getCachedData(
      "groups",
      () =>
        get(`${publicationId}/groups`).then((groups) => {
          const sortedGroups = groups.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name < b.name) return -1;
            return 0;
          });
          return sortedGroups;
        }),
      3600,
    );
  }
  static async lessons(groupId) {
    return getCachedData(
      `lessons-${groupId}`,
      () =>
        post({
          url: "group/lessons",
          data: {
            publicationId,
            groupId,
            date: format(
              startOfWeek(new Date(), { weekStartsOn: -6 }),
              "yyyy-MM-dd",
            ),
          },
        }),
      3600,
    );
  }
}
