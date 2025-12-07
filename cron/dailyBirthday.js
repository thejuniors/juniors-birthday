import cron from "node-cron";
import {
  getBirthdaysToday,
  formatBirthdayMessage
} from "../services/birthday.js";

export function dailyBirthday(client) {
  cron.schedule("0 9 * * *", async () => {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    if (!channel) return;

    const birthdays = getBirthdaysToday();

    for (const user of birthdays) {
      const msg = formatBirthdayMessage(user);

      await channel.send({
        content: msg,
      });
    }
  }, {
    timezone: "America/Sao_Paulo"
  });
}
