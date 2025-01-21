import fetch from "node-fetch";

import redisClient from "./redis.js";

import { format, startOfWeek } from "date-fns";

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
    const cache = await redisClient.get("groups");
    if (cache !== null) return JSON.parse(cache);

    return get(`${publicationId}/groups`).then(async (groups) => {
      const sortedGroups = groups.sort((a, b) => {
        if (a.name > b.name) return 1;
        if (a.name < b.name) return -1;
        return 0;
      });

      await redisClient.set("groups", JSON.stringify(sortedGroups));
      redisClient.expire("groups", 3600);
      return sortedGroups;
    });
  }
  static async lessons(groupId) {
    const cache = await redisClient.get(`lessons-${groupId}`);
    if (cache !== null) return JSON.parse(cache);

    return post({
      url: "group/lessons",
      data: {
        publicationId,
        groupId,
        date: format(
          startOfWeek(new Date(), { weekStartsOn: -6 }),
          "yyyy-MM-dd",
        ),
      },
    }).then(async (lessons) => {
      await redisClient.set(`lessons-${groupId}`, JSON.stringify(lessons));
      redisClient.expire(`lessons-${groupId}`, 3600);
      return lessons;
    });
  }
}
