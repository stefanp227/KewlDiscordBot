const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const fs = require('fs');

var parser = require('rss-parser');
var feedParsed = [];

client.login(config.token);

function parseStuff(channel, rssLink) {
  parser.parseURL(rssLink, function(err, parsed) {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    var filteredFeed = parsed.feed.entries.filter(function(v) {
      if((new Date(v.pubDate).getTime() > yesterday.getTime())) {
        return v;
      }
    });

    filteredFeed.forEach(function(entry) {
      if (feedParsed.includes(entry)) {
        return;
      } else {
	feedParsed.push(entry);
	channel.send(entry.title + ' : ' + entry.link);
      }
    });
  });
};

client.on('message', (message) => {
  const botChannel = client.channels.find('name', 'bot');
  if (!(message.channel == botChannel)) return;

  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  var msgArray = message.content.split(' ');

  if(!(msgArray.length == 2)) {
    return;
  } else {
    var command = msgArray[0];

    if (command == (config.prefix + '')) {
      config.rssLink = msgArray[1];

      fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);

      botChannel.send("Link set to : " + config.rssLink);

      parseStuff(botChannel, config.rssLink)
    }
  }
});
