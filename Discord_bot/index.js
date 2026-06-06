import { Client, Events, GatewayIntentBits } from 'discord.js';
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on('messageCreate', message => {
    if (message.author.bot) return; // Ignore messages from bots
    if (message.content.startsWith('create')) {
        const url = message.content.split('create ')[1]; // Get the URL from the command
        message.reply(`Here is your short URL: ${url}`);
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
        await interaction.reply('Pong!');
    }
});

client.login('MTUxMTQwMjUzNTIyMTQ2MTA5Mg.G_C6Ac.RQYqBdUAO6gSpk8iRN3s43rvr6IpM8awaykmlA');