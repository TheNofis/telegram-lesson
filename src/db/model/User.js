import { model, Schema } from "mongoose";
import { v4 } from "uuid";

const Mgok = new Schema({
  groupName: { type: String, default: null },
  curse: { type: Number, default: null },
});

const Hexlet = new Schema({
  groupName: { type: String, default: null },
  groupId: { type: Number, default: null },
});

const User = new Schema({
  id: { type: String, default: v4(), required: true, unique: true },
  username: { type: String, required: true },
  telegramId: { type: Number, required: true },
  createdAt: { type: Number, default: Date.now() },
  mgok: { type: Mgok },
  hexlet: { type: Hexlet },
  role: { type: String, default: "user" },
  table: { type: Boolean, default: 0 }, // 0 - text, 1 - photo
});
export default model("User", User);
