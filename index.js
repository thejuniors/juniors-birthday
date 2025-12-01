import { Client, GatewayIntentBits } from "discord.js";
import cron from "node-cron";
import fs from "fs";
const birthdays = JSON.parse(fs.readFileSync("./birthdays.json", "utf8"));
import "dotenv/config";

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

client.once("clientReady", () => {
  console.log(`Bot online como ${client.user.tag}`);

  // Executa todo dia às 8h
  cron.schedule("0 8 * * *", () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const todayStr = `${day}-${month}`;

    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) return;

    birthdays.forEach(user => {
      if (user.birthday === todayStr) {
        channel.send(
          `🎉 **Hoje é aniversário do(a) <@${user.id}>!** 🎂  
Marquem ele(a) e mandem os parabéns! 🚀`
        );
      }
    });
  }, {
    timezone: "America/Sao_Paulo"
  });
});

client.login(TOKEN);
