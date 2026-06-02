import { Client, Events, GatewayIntentBits } from 'discord.js';
import axios from 'axios';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});

const API_BASE_URL = 'http://localhost:8003';
const COMMAND_PREFIX = '!';

// Event: Bot is ready
client.on(Events.ClientReady, () => {
    console.log(`✅ Discord Bot logged in as ${client.user.tag}`);
});

// Event: Message received
client.on('messageCreate', async message => {
    // Ignore messages from bots
    if (message.author.bot) return;

    // Check if message starts with the command prefix
    if (!message.content.startsWith(COMMAND_PREFIX)) return;

    const args = message.content.slice(COMMAND_PREFIX.length).trim().split(/\s+/);
    const command = args.shift().toLowerCase();

    // !shorten <url> command
    if (command === 'shorten') {
        const url = args.join(' ');

        if (!url) {
            return message.reply('❌ Please provide a URL. Usage: `!shorten <url>`');
        }

        // Validate URL format
        if (!isValidURL(url)) {
            return message.reply('❌ Invalid URL format. Please provide a valid URL starting with http:// or https://');
        }

        try {
            message.channel.sendTyping();
            const response = await axios.post(`${API_BASE_URL}/url`, { url });
            const { shortURL } = response.data;

            return message.reply({
                content: `🔗 **Short URL Generated!**\n\n📌 Original: ${url}\n🚀 Shortened: \`${shortURL}\`\n\n*(Click to open)*`,
                flags: 0
            });
        } catch (error) {
            console.error('Error calling shortener API:', error.message);
            return message.reply('❌ Failed to create short URL. Make sure the API server is running at http://localhost:8003');
        }
    }

    // !help command
    if (command === 'help') {
        return message.reply({
            content: `📚 **Discord URL Shortener Bot Commands**\n\n` +
                `\`!shorten <url>\` - Convert a long URL to a short one\n` +
                `\`!help\` - Show this help message\n\n` +
                `**Example:**\n\`!shorten https://www.example.com/very/long/url\``
        });
    }
});

// Event: Error handling
client.on('error', error => {
    console.error('Discord bot error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Helper function to validate URLs
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Login to Discord
client.login(process.env.DISCORD_TOKEN || 'YOUR_DISCORD_BOT_TOKEN_HERE');
