require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.on("ready", () => {
  console.log("Logged in as " + client.user.tag);
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.content === "hello") {
    message.reply("Hi, Đạt bê đê");
  }
});
