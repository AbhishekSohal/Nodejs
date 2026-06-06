require('dotenv').config();
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { createShortURL } = require('./controllers/url');
const { getOrCreateUser } = require('./controllers/user');

// Start the existing Express app and MongoDB connection
require('./server');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) {
  console.error('Missing required environment variable DISCORD_TOKEN.');
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});


client.once(Events.ClientReady, readyClient => {
  console.log(`✅ Discord bot ready as ${readyClient.user.tag}`);
});

client.on('messageCreate', async message => {
  try {
    if (message.author.bot) return;// ignore messages from bots

    if (message.content.startsWith('create ')) {
      const urlToShorten = message.content.slice('create '.length).trim();

      if (!urlToShorten) {
        return message.reply('❌ Please provide a URL. Usage: `create <URL>`');
      }

      await message.reply('⏳ Creating short URL...');
      const user = await getOrCreateUser(message.author);
      const result = await createShortURL(urlToShorten, user ? user._id : null);// Pass user ID if available

      if (result.error) {
        return message.reply(`❌ Error: ${result.error}`);
      }

      return message.reply(
        `✅ Short URL created!\n` +
        `Original: ${urlToShorten}\n` +
        `Short URL: ${result.shortURL}`
      );
    }
  } catch (error) {
    console.error('Error handling message:', error);
    message.reply('❌ An error occurred while processing your request.');
  }
});

client.login(DISCORD_TOKEN);
