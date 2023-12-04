import { Router } from "express";
import {
  createDiscordUsers,
  getDiscordUserPresents,
  getDiscordGuildPresents,
  createPresent,
  getDiscordGuildUsers,
  updateDiscordUsers,
  createDiscordUserPresents,
  getAllGuilds,
  addGuilds,
} from "./mongodb.js";
import bodyParser from "body-parser";

const router = Router();

router.get("/status", (req, res) => {
  res.send(`Healthy: ${Date.now()}`);
});

router.post("/discord/guild", bodyParser.json(), async (req, res) => {
  res.send(await addGuilds(req.body));
});

router.get("/discord/guild", async (req, res) => {
  res.send(await getAllGuilds());
});

router.get(
  "/discord/guild/:guildId/user/:discordId/present",
  async (req, res) => {
    res.send(
      await getDiscordUserPresents(req.params.guildId, req.params.discordId)
    );
  }
);

router.get("/discord/guild/:guildId/present", async (req, res) => {
  res.send(
    await getDiscordGuildPresents(req.params.guildId, req.params?.discordId)
  );
});

router.post(
  "/discord/guild/:guildId/user/:discordId/present",
  bodyParser.json(),
  async (req, res) => {
    res.send(
      await createDiscordUserPresents(
        req.params.guildId,
        req.params.discordId,
        req.body
      )
    );
  }
);

router.post(
  "/discord/guild/:guildId/user",
  bodyParser.json(),
  async (req, res) => {
    res.send(await createDiscordUsers(req.params.guildId, req.body));
  }
);

router.get("/discord/guild/:guildId/user", async (req, res) => {
  res.send(
    await getDiscordGuildUsers(req.params.guildId, req.query?.discordUserIds)
  );
});

router.put(
  "/discord/guild/:guildId/user",
  bodyParser.json(),
  async (req, res) => {
    res.send(await updateDiscordUsers(req.params.guildId, req.body));
  }
);

router.post("/present", bodyParser.json(), async (req, res) => {
  res.send(
    await createPresent(
      req.body.description,
      req.body.priority,
      req.body.userId
    )
  );
});

export default router;
