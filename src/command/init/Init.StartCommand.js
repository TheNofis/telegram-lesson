import CommandStart from "../start/Command.Start.js";

export default class {
  constructor(bot) {
    this.bot = bot;
    this.initCommandList = [];
  }
  handle() {
    this.bot.start((ctx) => {
      const startCommand = new CommandStart(this.bot, ctx);
      startCommand.handle();
    });
  }
}
