const fs = require('fs');
const path = require('path');

exports.config = {
  name: 'help',
  description: 'Show available commands',
  author: 'System',
  category: 'system',
  guide: ''
};

exports.initialize = async function({ senderId, args, token, bot }) {
  const commandsDir = path.join(__dirname, '../commands');
  const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

  const commands = commandFiles.map(file => {
    const command = require(path.join(commandsDir, file));
    return `⦿ ${command.config.name}\n  - ${command.config.description}`;
  });

  const totalCommands = commandFiles.length;
  const helpMessage = `List of Commands\n\n${commands.join('\n\n')}\n\nTotal Commands: ${totalCommands}`;

  bot.send(senderId, { text: helpMessage }, token);
};
