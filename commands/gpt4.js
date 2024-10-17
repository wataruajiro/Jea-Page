const axios = require('axios');

exports.config = {
  name: 'gpt4',
  description: 'Ask a question to GPT-4',
  author: 'Deku (rest api)',
  category: 'ai',
  guide: '<question>'
};

exports.initialize = async function({ senderId, args, token, bot }) {
  const prompt = args.join(' ');  // Joins arguments with a space
  try {
    const apiUrl = `https://deku-rest-apis.ooguy.com/gpt4?prompt=${encodeURIComponent(prompt)}&uid=100${senderId}`;
    const response = await axios.get(apiUrl);
    const text = response.data.gpt4;

    // Split the response into chunks if it exceeds 2000 characters
    const maxMessageLength = 2000;
    if (text.length > maxMessageLength) {
      const messages = splitMessageIntoChunks(text, maxMessageLength);
      for (const message of messages) {
        bot.send(senderId, { text: message }, token);
      }
    } else {
      bot.send(senderId, { text }, token);
    }
  } catch (error) {
    console.error('Error calling GPT-4 API:', error);
    sendMessage(senderId, { text: 'Please enter a valid question.' }, pageAccessToken);
  }
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));  // Fix line break in chunkSize addition
  }
  return chunks;
}
