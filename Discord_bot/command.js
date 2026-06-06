import { REST, Routes } from 'discord.js';
const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name:'create',
    description:'creates a short url for the given url',
  }
];

const rest = new REST({ version: '10' }).setToken('MTUxMTQwMjUzNTIyMTQ2MTA5Mg.G_C6Ac.RQYqBdUAO6gSpk8iRN3s43rvr6IpM8awaykmlA');
const applicationId = '1511402535221461092';
try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands(applicationId), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}