import CommandStart from "../start/Command.Start.js";

export default class {
  constructor(bot) {
    this.bot = bot;
    this.initCommandList = [];
  }
  handle() {
    this.bot.start((ctx) => {
      const payload = {
        bot: this.bot,
        ctx: ctx,
      };
      const startCommand = new CommandStart(payload);
      startCommand.handle();
    });
  }
}
