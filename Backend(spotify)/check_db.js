require('dotenv').config();
const connectDB = require('./src/db/db');
const musicModel = require('./src/models/music.model');
const albumModel = require('./src/models/album.model');
const userModel = require('./src/models/user.model');

async function check() {
  await connectDB();
  const musics = await musicModel.find().populate('artist', 'username role');
  const albums = await albumModel.find().populate('artist', 'username').populate('musics', 'title');
  const artists = await userModel.find({ role: 'artist' }).select('username email role');

  console.log('=== DATABASE VERIFICATION ===');
  console.log('Total Songs in DB:', musics.length);
  musics.forEach((m, i) => {
    console.log(`${i + 1}. [${m._id}] "${m.title}" by ${m.artist ? m.artist.username : 'Unknown'} -> URI: ${m.uri}`);
  });

  console.log('\nTotal Albums in DB:', albums.length);
  albums.forEach((a, i) => {
    console.log(`${i + 1}. [${a._id}] "${a.title}" by ${a.artist ? a.artist.username : 'Unknown'} (${a.musics.length} tracks: ${a.musics.map(m => m.title).join(', ')})`);
  });

  console.log('\nTotal Verified Artists in DB:', artists.length);
  artists.forEach((u, i) => {
    console.log(`${i + 1}. ${u.username} (${u.email}) [ID: ${u._id}]`);
  });

  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
