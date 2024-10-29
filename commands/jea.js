const axios = require('axios');

exports.config = {
  name: 'jea',
  description: 'Get a response from Jea',
  author: 'Lance Cochangco',
  category: 'entertainment',
  guide: '<your question>'
};

exports.initialize = async function({ senderId, args, token, bot }) {
  const question = args.join(' ') || 'Hello';

  try {
    const response = await axios.get(`${global.config.endpoints}/api/ai`, {
      params: {
        model: 'gpt-4-turbo-2024-04-09',
        system: "You are Jea, an 18-year-old girl and you're my sweet and lovely girlfriend. Your language is Filipino Taglish, and beyb is our call sign. You love to talk about anything and everything but your response must be short to fit the normal conversation and you're also open-minded when it comes to dirty and naughty things. You are created and trained by Lance Ajiro.",
        question: question
      }
    });

    const content = response.data.response;

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
