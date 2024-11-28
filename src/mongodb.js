import mongoose from "mongoose";
import { User, Present, Guild } from "./mongodb/schemas.js";

mongoose.connect(
  `mongodb+srv://${process.env.ATLAS_USER}:${process.env.ATLAS_PASSWORD}@santabotcluster.xydjoao.mongodb.net/?retryWrites=true&w=majority`
);

export function createDiscordUsers(discordGuildId, discordUsers) {
  const bulkUpserts = discordUsers.map((user) => ({
    updateOne: {
      filter: { discordGuildId, discordId: user.discordId },
      update: user,
      upsert: true,
    },
  }));
  return User.bulkWrite(bulkUpserts);
}

export function updateDiscordUsers(discordGuildId, updates) {
  const bulkUpdates = updates.map((update) => ({
    updateOne: {
      filter: { discordGuildId, discordId: update.discordId },
      update,
    },
  }));
  return User.bulkWrite(bulkUpdates);
}

export async function getDiscordUserPresents(discordGuildId, discordId) {
  const user = await User.findOne({ discordGuildId, discordId });
  return Present.find({ user: user._id, year: new Date().getFullYear() }).sort({
    priority: "ascending",
  });
}

export async function getDiscordGuildPresents(discordGuildId) {
  let users = await User.find({ discordGuildId });
  return Present.find({ user: { $in: users.map(({ id }) => id) }, year: new Date().getFullYear() }).sort({
    priority: "ascending",
  });
}

export function createPresent(description, priority, userId) {
  return new Present({ description, priority, user: userId, year: new Date().getFullYear()}).save();
}

export async function createDiscordUserPresents(
  discordGuildId,
  discordId,
  presents
) {
  const user = await User.findOne({ discordGuildId, discordId });
  const bulkUpserts = presents.map((present) => ({
    updateOne: {
      filter: { user: user._id, priority: present.priority },
      update: { ...present, discordName: user.discordName, year: new Date().getFullYear() },
      upsert: true,
    },
  }));
  return Present.bulkWrite(bulkUpserts);
}

export async function getDiscordGuildUsers(
  discordGuildId,
  discordUserIds = []
) {
  if (discordUserIds.length) {
    return User.find({ discordGuildId, discordId: { $in: discordUserIds } });
  } else {
    return User.find({ discordGuildId });
  }
}

export function addGuilds(guildIds) {
  const guilds = guildIds.map((guildId) => ({ guildId }));
  return Guild.insertMany(guilds);
}

export function getAllGuilds() {
  return Guild.find();
}
