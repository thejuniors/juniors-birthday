import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";

import { dailyBirthday } from "./cron/dailyBirthday.js";
import { ogWarnings } from "./cron/ogWarnings.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

client.once("clientReady", () => {
  dailyBirthday(client);
  ogWarnings(client);
});

client.login(process.env.DISCORD_TOKEN);