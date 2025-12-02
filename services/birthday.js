import fs from "fs";

const birthdays = JSON.parse(fs.readFileSync("./birthdays.json", "utf8"));

export function getBirthdaysToday() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const todayStr = `${day}-${month}`;

  return birthdays.filter(user => user.birthday === todayStr);
}

export function getOGs() {
  return birthdays.filter(user => user.og);
}

export function daysUntil(dateStr) {
  const [day, month] = dateStr.split("-").map(Number);
  const today = new Date();
  const currentYear = today.getFullYear();

  let next = new Date(currentYear, month - 1, day);
  if (next < today) next = new Date(currentYear + 1, month - 1, day);

  const diff = next - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function getAge(user) {
  if (!user.year) return null;

  const today = new Date();
  return today.getFullYear() - user.year;
}

export function formatBirthdayMessage(user) {
  const age = getAge(user);
  const mention = user.id ? `<@${user.id}>` : user.name;

  if (age) {
    return (
      `@everyone 🎉 **Hoje é aniversário de ${mention}!** 🎂\n` +
      `Ele(a) está fazendo **${age} anos**! 🎉`
    );
  }

  return `@everyone 🎉 **Hoje é aniversário de ${mention}!** 🎂`;
}
