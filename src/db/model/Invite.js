import { model, Schema } from "mongoose";
import { v4 } from "uuid";

const Invite = new Schema({
  id: { type: String, default: v4(), required: true, unique: true },
  invite: { type: String, default: v4(), required: true, unique: true },
  creatorId: { type: String, required: true },
  createdAt: { type: Number, default: Date.now },
  count: { type: Number, default: 1 },
  active: { type: Boolean, default: false },
});

export default model("Invite", Invite);
