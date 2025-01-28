import CallbackClass from "./Callback.Class.js";
import { redisClient } from "../../db/connect/redis.js";

import User from "../../db/model/User.js";

export default class extends CallbackClass {
  async handle() {
    if (this.data === "changeTable") {
      User.updateOne(
        { telegramId: this?.user?.telegramId },
        { table: !this?.user?.table },
      )
        .then(async () => {
          await redisClient
            .del(`user:${this?.user?.telegramId}`)
            .catch(console.error);

          this.ctx
            .answerCbQuery(
              `Режим отображения: ${this.user.table ? "Текст" : "Картинка"}`,
            )
            .catch(console.error);
        })
        .catch(console.error);
    }
  }
}
