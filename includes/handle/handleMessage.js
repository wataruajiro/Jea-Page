const fs = require('fs');
const path = require('path');
const { sendMessage } = require('./sendMessage');
const config = require('../../config.json');

// Define the bot object that will encapsulate sendMessage and pageAccessToken
const bot = {
  send: sendMessage,  // For sending message
};

// Load all command files and store them in a Map
const commands = new Map();
const prefix = config.prefix;

// Load all commands from the command folder
const commandFiles = fs.readdirSync(path.join(__dirname, '../../commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`../../commands/${file}`);
  if (command.config && command.config.name) {
    commands.set(command.config.name.toLowerCase(), command);
  }
}

async function handleMessage(event, pageAccessToken) {
  const senderId = event.sender.id;
  const messageText = event.message.text.trim();

  // Assign pageAccessToken to bot.token
  token = pageAccessToken;

  if (messageText.startsWith(prefix)) {
    const args = messageText.slice(prefix.length).split(' ');
    const commandName = args.shift().toLowerCase();

    if (commands.has(commandName)) {
      const command = commands.get(commandName);
      try {
        await command.initialize({
          senderId,
          args,
          bot,
          token
        });
      } catch (error) {
        console.error(`Error executing command ${commandName}:`, error);
        bot.send(senderId, { text: 'There was an error executing that command.' }, bot.token);
      }
    }
    return;
  }

  // Default to 'ai' command if no other command matches
  const aiCommand = commands.get('ai');
  if (aiCommand) {
    try {
      await aiCommand.initialize({
        senderId,
        args: [messageText],  // Pass the entire message as args for AI processing
        bot  // Pass bot object
      });
    } catch (error) {
      console.error('Error executing AI command:', error);
      bot.send(senderId, { text: 'There was an error processing your request.' }, bot.token);
    }
  }
}

module.exports = {
  handleMessage
};
