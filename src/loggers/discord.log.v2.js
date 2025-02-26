require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");

class DiscordLoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
      ],
    });
    // add channel id
    this.channelId = process.env.DISCORD_CHANNEL_ID;
    this.client.on("ready", () => {
      console.log("Logged in as " + this.client.user.tag);
    });
    this.client.login(process.env.DISCORD_BOT_TOKEN);
  }
  sendToFormatCode(logData) {
    const {
      code,
      message = "This is some additional information about the code",
      title = "Code example",
    } = logData;
    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16),
          title: title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    this.sendToMessage(codeMessage);
  }

  sendToMessage(message = "message") {
    const channel = this.client.channels.cache.get(this.channelId);
    if (!channel) {
      console.log("Channel not found");
      return;
    }
    channel.send(message).catch((err) => {
      console.log("Error on send message", err);
    });
  }
}

module.exports = new DiscordLoggerService();
