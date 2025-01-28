export default class CommandClass {
  constructor(props) {
    this.bot = props.bot;
    this.ctx = props.ctx;
    this.user = props.user;
    this.data = props.ctx?.update?.callback_query?.data;
    this.chatId = props.ctx?.update?.callback_query?.message?.chat?.id;
    this.userId = props.ctx?.update?.message?.from?.id;
  }
}
