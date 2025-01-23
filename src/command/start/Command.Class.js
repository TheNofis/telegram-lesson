export default class CommandClass {
  constructor(props) {
    this.bot = props.bot;
    this.ctx = props.ctx;
    this.chatId = props.ctx?.update?.message?.chat?.id;
    this.userId = props.ctx?.update?.message?.from?.id;
    this.text = props.ctx?.update?.message?.text;
  }
}
