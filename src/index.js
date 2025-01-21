import * as dotenv from "dotenv";
import { Telegraf } from "telegraf";

import InitStartCommand from "./command/init/Init.StartCommand.js";
import InitTextCommand from "./command/init/Init.TextCommands.js";
// import CallbackCommandInit from "./CallbackCommandInit.js";

import "./db/connect/mongodb.js";
dotenv.config();

const token = process.env.BOT_TOKEN;

class Bot {
  constructor(props) {
    this.bot = new Telegraf(props.BOT_TOKEN);
    this.initCommandList = [];
  }
  init() {
    const payload = this.bot;
    this.initCommandList = [
      new InitStartCommand(payload),
      new InitTextCommand(payload),
      // new CallbackCommandInit(this.bot),
    ];

    this.initCommandList.forEach((command) => command.handle());

    this.bot
      .launch()
      .then(() => console.log("Bot is ready"))
      .catch((err) => console.error("Bot is not ready", err));
  }
}

const bot = new Bot({ BOT_TOKEN: token });
bot.init();
