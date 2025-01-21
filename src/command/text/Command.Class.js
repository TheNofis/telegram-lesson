export default class CommandClass {
  constructor(props) {
    this.bot = props.bot;
    this.ctx = props.ctx;
    this.user = props.user;
    this.chatId = props.ctx?.update?.message?.chat?.id;
    this.text = props.ctx?.update?.message?.text;
  }
}
