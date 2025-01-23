import { model, Schema } from "mongoose";
import { v4 } from "uuid";

const Advertisement = new Schema({
  id: { type: String, default: v4(), required: true, unique: true },
  content: { type: String, required: true },
  createdAt: { type: Number, default: Date.now },
  creatorId: { type: Number, required: true },
  image: { type: String, default: null },
});

export default model("Invite", Invite);
