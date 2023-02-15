// const faker = require('faker'); 
const userSeeds = require('./userSeed.json');
const movieSeeds = require('./movieSeed.json');
const messageSeeds = require('./messageSeed.json');
const db = require('../config/connection');
const { Movie, User, Message } = require('../models');

db.once('open', async () => {
  try {
    await Movie.deleteMany({});
    await Message.deleteMany({});
    await User.deleteMany({});

    await User.create(userSeeds);

    // for (let i = 0; i < movieSeeds.length; i++) {
    //   const { _id, thoughtAuthor } = await Movie.create(movieSeeds[i]);
    //   const user = await User.findOneAndUpdate(
    //     { username: thoughtAuthor },
    //     {
    //       $addToSet: {
    //         savedMovie: _id,
    //       },
    //     }
    //   );
    // }
    for (let i = 0; i < messageSeeds.length; i++) {
      const { _id, username } = await Message.create(messageSeeds[i]);
      const user = await User.findOneAndUpdate(
        { username: username },
        {
          $addToSet: {
            messages: _id,
          },
        }
      );
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  console.log('all done!');
  process.exit(0);
});
