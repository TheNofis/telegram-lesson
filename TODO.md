# TODO: Сделать рекурсивную функцию для отправки рекламы

Example:

```js
async startSend(step, users, promo) {
if (step > users.length) return;

const { image, caption } = promo;
this.bot.telegram
  .sendPhoto(users[step].id, { url: image }, { caption: caption })
  .then(() => {
    console.log(`good send id: ${step}`);
    setTimeout(() => {
      this.startSend(step + 1, users, promo);
    }, 100);
  })
  .catch((e) => {
    console.log(`bad send id: ${step} ${e}`);
    this.startSend(step + 1, users, promo);
  });
}
```
