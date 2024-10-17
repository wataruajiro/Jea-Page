const axios = require('axios');

exports.config = {
  name: 'jea',
  description: 'Get a response from Jea',
  author: 'Lance Cochangco',
  category: 'entertainment',
  guide: '<your question>'
};

exports.initialize = async function({ senderId, args, token, bot }) {
  const question = args.join(' ') || 'hi';

  try {
    const response = await axios.get(`${global.config.endpoints}/api/jea?question=${encodeURIComponent(question)}`);
    const content = response.data.content;

    if (content) {
      bot.send(senderId, { text: content }, token);
    } else {
      bot.send(senderId, { text: 'Sorry, no response found.' }, token);
    }
  } catch (error) {
    console.error('Error retrieving response from Jea:', error);
    bot.send(senderId, { text: 'Sorry, there was an error processing your request.' }, token);
  }
};
