import { Schema, model } from "mongoose";

const guildSchema = new Schema({
  guildId: String,
});
guildSchema.index({ guildId: 1 }, { unique: true });

export const Guild = model("Guild", guildSchema);

const userSchema = new Schema({
  karma: { type: Number, default: 0 },
  discordId: String,
  discordName: String,
  discordGuildId: String,
  presents: [{ type: Schema.Types.ObjectId, ref: "Present" }],
});
userSchema.index({ discordId: 1, discordGuildId: 1 }, { unique: true });

export const User = model("User", userSchema);

const presentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  discordName: String,
  description: String,
  priority: Number,
  year: Number
});
userSchema.index({ user: 1, priority: 1 }, { unique: true });

export const Present = model("Present", presentSchema);
