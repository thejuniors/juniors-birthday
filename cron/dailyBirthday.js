import cron from "node-cron";
import { getBirthdaysToday, formatBirthdayMessage } from "../services/birthday.js";

export function dailyBirthday(client) {
  cron.schedule("0 8 * * *", () => {
    const channel = client.channels.cache.get(process.env.CHANNEL_ID);
    if (!channel) return;

    const birthdays = getBirthdaysToday();

    birthdays.forEach(user => {
      const msg = formatBirthdayMessage(user);
      channel.send(msg);
    });
  }, {
    timezone: "America/Sao_Paulo"
  });
}
