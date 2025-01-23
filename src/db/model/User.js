import { model, Schema } from "mongoose";
import { v4 } from "uuid";

const User = new Schema({
  id: { type: String, default: v4(), required: true, unique: true },
  username: { type: String, required: true },
  telegramId: { type: Number, required: true },
  createdAt: { type: Number, default: Date.now },
  groupName: { type: String, default: null },
  groupId: { type: Number, default: null },
  role: { type: String, default: "user" },
  // TODO: add role / roles (на выбор, что получится)
  // Отличие:
  // role - String
  // roles - Array<String>
});

export default model("User", User);
