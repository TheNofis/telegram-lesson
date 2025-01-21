import CommandStart from "../start/Command.Start.js";

export default class {
  constructor(bot) {
    this.bot = bot;
    this.initCommandList = [];
  }
  handle() {
    this.bot.start((ctx) => {
      this.initCommandList = [new CommandStart(this.bot, ctx)];
      this.initCommandList.forEach((command) => command.handle());
    });
  }
}
