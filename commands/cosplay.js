const axios = require('axios');

exports.config = {
  name: 'cosplay', 
  description: 'Fetch a cosplay video', 
  author: 'Lance Cochangco', 
  category: 'entertainment', 
  guide: '' 
};

exports.initialize = async function({ senderId, args, token, bot }) {
  try {
    // Call the Ajiro REST API to get the cosplay video
    const response = await axios.get(`${global.config.endpoints}/api/cosplay`);
    const videoUrl = response.data.videoUrl;

    if (videoUrl) {
      // Send the video as an attachment
      bot.send(senderId, {
        attachment: {
          type: 'video',
          payload: {
            url: videoUrl,
            is_reusable: true // Optional: depending on your bot platform's requirements
          }
        }
      }, token);
    } else {
      bot.send(senderId, { text: 'Sorry, no video found.' }, token);
    }
  } catch (error) {
    console.error('Error retrieving cosplay video:', error);
    bot.send(senderId, { text: 'Sorry, there was an error processing your request.' }, token);
  }
};
