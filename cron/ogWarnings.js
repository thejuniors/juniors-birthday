import cron from "node-cron";
import { getOGs, daysUntil } from "../services/birthday.js";

export function ogWarnings(client) {
  cron.schedule("30 8 * * *", () => {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    if (!channel) return;

    const OGs = getOGs();

    OGs.forEach(user => {
      const days = daysUntil(user.birthday);

      if ([15, 7, 1].includes(days)) {
        const message = days === 1
          ? `🚨🚨 **ALERTA MÁXIMO!** 🚨🚨  
AMANHÃ É O ANIVERSÁRIO DO OG **<@${user.id}>**!!! 🎉🔥`
          : `📢 **Atenção!**  
Faltam **${days} dias** para o aniversário do OG <@${user.id}>! 🎉`;

        channel.send(message);
      }
    });
  }, {
    timezone: "America/Sao_Paulo"
  });
}
