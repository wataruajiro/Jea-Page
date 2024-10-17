const axios = require('axios');

exports.config = {
  name: 'lyrics',
  description: 'Fetch song lyrics',
  author: 'Deku (rest api)',
  category: 'music',
  guide: '<song name>'
};

exports.initialize = async function({ senderId, args, token, bot }) {
  const query = args.join(' ');
  try {
    const apiUrl = `https://deku-rest-apis.ooguy.com/search/lyrics?q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);
    const result = response.data.result;

    if (result && result.lyrics) {
      const lyricsMessage = `Title: ${result.title}\nArtist: ${result.artist}\n\n${result.lyrics}`;

      // Split the lyrics message into chunks if it exceeds 2000 characters
      const maxMessageLength = 2000;
      if (lyricsMessage.length > maxMessageLength) {
        const messages = splitMessageIntoChunks(lyricsMessage, maxMessageLength);
        for (const message of messages) {
          bot.send(senderId, { text: message }, token);
        }
      } else {
        bot.send(senderId, { text: lyricsMessage }, token);
      }

      // Optionally send an image if available
      if (result.image) {
        bot.send(senderId, {
          attachment: {
            type: 'image',
            payload: {
              url: result.image,
              is_reusable: true
            }
          }
        }, token);
      }
    } else {
      console.error('Error: No lyrics found in the response.');
      bot.send(senderId, { text: 'Sorry, no lyrics were found for your query.' }, token);
    }
  } catch (error) {
    console.error('Error calling Lyrics API:', error);
    bot.send(senderId, { text: 'Sorry, there was an error processing your request.' }, token);
  }
};

function splitMessageIntoChunks(message, chunkSize) {
  const chunks = [];
  for (let i = 0; i < message.length; i += chunkSize) {
    chunks.push(message.slice(i, i + chunkSize));
  }
  return chunks;
}
