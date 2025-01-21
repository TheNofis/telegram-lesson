import * as dotenv from "dotenv";
import { Telegraf } from "telegraf";
import mongoose from "mongoose";

import InitStartCommand from "./command/init/Init.StartCommand.js";
import InitTextCommand from "./command/init/Init.TextCommands.js";
// import CallbackCommandInit from "./CallbackCommandInit.js";

import mongoConnect from "./db/connect/mongodb.js";
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
    const payload = this.bot;
    this.initCommandList = [
      new InitStartCommand(payload),
      new InitTextCommand(payload),
      // new CallbackCommandInit(this.bot),
    ];

    this.initCommandList.forEach((command) => command.handle());

    mongoConnect();
    this.bot
      .launch()
      .then(() => console.log("Bot is ready"))
      .catch((err) => console.error("Bot is not ready", err));
  }
}

const bot = new Bot({ BOT_TOKEN: token, MONGODB_URL: mongodbUrl });
bot.init();
