import * as dotenv from "dotenv";
import { Telegraf } from "telegraf";
import mongoose from "mongoose";

import StartCommandInit from "./command/init/StartCommand.Init.js";
import TextCommandInit from "./command/init/TextCommand.Init.js";
// import CallbackCommandInit from "./CallbackCommandInit.js";

dotenv.config();

const token = process.env.BOT_TOKEN;
const mongodbUrl = process.env.MONGODB_URI;
class Bot {
  constructor(props) {
    this.bot = new Telegraf(props.BOT_TOKEN);
    this.initCommandList = [];
    this.mongoDBUrl = mongodbUrl;
  }
  init() {
    this.initCommandList = [
      new StartCommandInit(this.bot),
      new TextCommandInit(this.bot),
      // new CallbackCommandInit(this.bot),
    ];

    this.initCommandList.forEach((command) => command.handle());

    mongoose
      .set("strictQuery", false)
      .connect(this.mongoDBUrl)
      .then(() => console.log("MongoDB connected"))
      .catch((err) => console.error("MongoDB not connected", err));

    this.bot
      .launch()
      .then(() => console.log("Bot is ready"))
      .catch((err) => console.error("Bot is not ready", err));
  }
}

const bot = new Bot({ BOT_TOKEN: token, MONGODB_URL: mongodbUrl });
bot.init();
