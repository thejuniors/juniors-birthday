import { Client, GatewayIntentBits } from "discord.js";
import cron from "node-cron";
import fs from "fs";
const birthdays = JSON.parse(fs.readFileSync("./birthdays.json", "utf8"));
import "dotenv/config";

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

function daysUntilOgsBirthday(birthdayStr) {
  const [day, month] = birthdayStr.split("-").map(n => parseInt(n));

  const today = new Date();
  const currentYear = today.getFullYear();

  let nextBirthday = new Date(currentYear, month - 1, day);

  if (nextBirthday < today) {
    nextBirthday = new Date(currentYear + 1, month - 1, day);
  }

  const diff = nextBirthday - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

client.once("clientReady", () => {
  // Verifica se tem alguém de aniversário no dia
  cron.schedule("0 8 * * *", () => {
    const today = new Date();
    const day = today.getDate().toString().padStart(2, "0");
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const todayStr = `${day}-${month}`;


    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) return;

    // Adicionei a verificação se tem o usuário tem ID caso contrário passa o nome da pessoa sem a menção com o @
    birthdays.forEach(user => {
      if (user.birthday === todayStr) {

        const mention = user.id
          ? `<@${user.id}>`
          : user.name;

        const age = user.year ? (today.getFullYear() - user.year) : null;

        const msg = age !== null
          ? `@everyone 🎉 **Hoje é aniversário do(a) ${mention}!** 🎂  
Ele(a) está fazendo **${age} anos**! 🎉  
Mandem os parabéns pra essa pessoa incrível! 🚀`
          : `@everyone 🎉 **Hoje é aniversário do(a) ${mention}!** 🎂  
Mandem os parabéns pra essa pessoa incrível! 🚀`;

        channel.send(msg);
      }
    });
  }, {
    timezone: "America/Sao_Paulo"
  });

  // Verifica os aniversários dos OGs (15, 7 e 1 dia antes)
  cron.schedule("30 8 * * *", () => {
    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) return;

    const OGs = birthdays.filter(user => user.og);

    OGs.forEach(user => {
      const days = daysUntilOgsBirthday(user.birthday);

      if ([15, 7, 1].includes(days)) {

        let message = "";

        if (days === 1) {
          message = `🚨🚨 **ALERTA MÁXIMO!** 🚨🚨  
AMANHÃ É O ANIVERSÁRIO DO OG **<@${user.id}>**!!!  
PREPAREM AS MENSAGENS, MEMES, PRESENTES E HOMENAGENS!!! 🎉🔥`;
        } else {
          message = `📢 **Atenção!**  
Faltam **${days} dias** para o aniversário de <@${user.id}>! 🎉`;
        }

        channel.send(message);
      }
    });

  }, {
    timezone: "America/Sao_Paulo"
  });

});

client.login(TOKEN);