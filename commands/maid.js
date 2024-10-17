const axios = require('axios');

exports.config = {
  name: 'maid',
  description: 'Get an image of a maid',
  author: 'Lance Cochangco',
  category: 'entertainment',
  guide: ''
};

exports.initialize = async function({ senderId, args, token, bot }) {
  try {
    const response = await axios.get(`${global.config.endpoints}/api/maid`);
    const { data } = response.data;

    if (data) {
      bot.send(senderId, {
        attachment: {
          type: 'image',
          payload: {
            url: data,
            is_reusable: true
          }
        }
      }, token);
    } else {
      bot.send(senderId, { text: 'Sorry, no image found.' }, token);
    }
  } catch (error) {
    console.error('Error retrieving maid data:', error);
    bot.send(senderId, { text: 'Sorry, there was an error processing your request.' }, token);
  }
};
