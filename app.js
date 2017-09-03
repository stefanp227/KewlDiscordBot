const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  const botChannel = client.channels.find('name', 'bot');
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

client.login('');
