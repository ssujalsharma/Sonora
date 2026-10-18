require('dotenv').config();
const connectDB = require('./src/db/db');
const userModel = require('./src/models/user.model');
const musicModel = require('./src/models/music.model');
const albumModel = require('./src/models/album.model');
const bcrypt = require('bcryptjs');

async function seed() {
  await connectDB();

  // Create or get artists
  const defaultPasswordHash = await bcrypt.hash('artist123', 10);

  async function getOrCreateArtist(username, email) {
    let artist = await userModel.findOne({ username });
    if (!artist) {
      artist = await userModel.create({
        username,
        email,
        password: defaultPasswordHash,
        role: 'artist'
      });
      console.log(`Created artist: ${username}`);
    }
    return artist;
  }

  const arijit = await getOrCreateArtist('Arijit Singh', 'arijit@sonora.fm');
  const diljit = await getOrCreateArtist('Diljit Dosanjh', 'diljit@sonora.fm');
  const apDhillon = await getOrCreateArtist('AP Dhillon', 'apdhillon@sonora.fm');
  const karanAujla = await getOrCreateArtist('Karan Aujla', 'karan@sonora.fm');
  const sidhu = await getOrCreateArtist('Sidhu Moose Wala', 'sidhu@sonora.fm');
  const pritam = await getOrCreateArtist('Pritam', 'pritam@sonora.fm');

  // Clear existing tracks & albums to do a fresh rich seed
  await musicModel.deleteMany({});
  await albumModel.deleteMany({});
  console.log('Cleared existing tracks and albums.');

  const desiTracks = [
    // --- HINDI HITS ---
    {
      title: 'Kesariya',
      uri: '/audio/kesariya.wav',
      artist: arijit._id,
      language: 'Hindi',
      genre: 'Bollywood Romance'
    },
    {
      title: 'Apna Bana Le',
      uri: '/audio/apna_bana_le.wav',
      artist: arijit._id,
      language: 'Hindi',
      genre: 'Bollywood Romance'
    },
    {
      title: 'Tum Hi Ho',
      uri: '/audio/tum_hi_ho.wav',
      artist: arijit._id,
      language: 'Hindi',
      genre: 'Bollywood Classic'
    },
    {
      title: 'Raataan Lambiyan',
      uri: '/audio/raataan_lambiyan.wav',
      artist: pritam._id,
      language: 'Hindi',
      genre: 'Bollywood Romance'
    },
    {
      title: 'Chaleya',
      uri: '/audio/chaleya.wav',
      artist: arijit._id,
      language: 'Hindi',
      genre: 'Bollywood Pop'
    },
    {
      title: 'Tere Vaaste',
      uri: '/audio/tere_vaaste.wav',
      artist: pritam._id,
      language: 'Hindi',
      genre: 'Trending Bollywood'
    },
    {
      title: 'Pehle Bhi Main',
      uri: '/audio/pehle_bhi_main.wav',
      artist: pritam._id,
      language: 'Hindi',
      genre: 'Soulful Hindi'
    },
    {
      title: 'Shayad',
      uri: '/audio/shayad.wav',
      artist: arijit._id,
      language: 'Hindi',
      genre: 'Acoustic Romance'
    },

    // --- PUNJABI HITS ---
    {
      title: 'Brown Munde',
      uri: '/audio/brown_munde.wav',
      artist: apDhillon._id,
      language: 'Punjabi',
      genre: 'Punjabi Trap'
    },
    {
      title: 'Lover',
      uri: '/audio/lover.wav',
      artist: diljit._id,
      language: 'Punjabi',
      genre: 'Punjabi Synthpop'
    },
    {
      title: 'Softly',
      uri: '/audio/softly.wav',
      artist: karanAujla._id,
      language: 'Punjabi',
      genre: 'Punjabi R&B'
    },
    {
      title: '295',
      uri: '/audio/295.wav',
      artist: sidhu._id,
      language: 'Punjabi',
      genre: 'Punjabi Hip-Hop'
    },
    {
      title: 'Born to Shine',
      uri: '/audio/born_to_shine.wav',
      artist: diljit._id,
      language: 'Punjabi',
      genre: 'Bhangra Pop'
    },
    {
      title: 'Excuses',
      uri: '/audio/excuses.wav',
      artist: apDhillon._id,
      language: 'Punjabi',
      genre: 'Punjabi Lo-Fi'
    },
    {
      title: 'Tauba Tauba',
      uri: '/audio/tauba_tauba.wav',
      artist: karanAujla._id,
      language: 'Punjabi',
      genre: 'Bhangra Dance'
    },
    {
      title: 'G.O.A.T.',
      uri: '/audio/goat.wav',
      artist: diljit._id,
      language: 'Punjabi',
      genre: 'Punjabi Anthem'
    }
  ];

  const inserted = await musicModel.insertMany(desiTracks);
  console.log(`Inserted ${inserted.length} Hindi & Punjabi songs.`);

  // Create Albums
  const hindiRomanticIds = inserted.slice(0, 4).map(t => t._id);
  const punjabiWaveIds = [inserted[8]._id, inserted[9]._id, inserted[10]._id, inserted[11]._id, inserted[12]._id, inserted[14]._id];
  const bollywoodDanceIds = [inserted[4]._id, inserted[5]._id, inserted[6]._id, inserted[7]._id];

  await albumModel.create([
    {
      title: 'Bollywood Romance Rewind',
      artist: arijit._id,
      musics: hindiRomanticIds
    },
    {
      title: 'Punjabi Wave: Diljit & AP Dhillon',
      artist: diljit._id,
      musics: punjabiWaveIds
    },
    {
      title: 'Late Night Hindi Lo-Fi',
      artist: pritam._id,
      musics: bollywoodDanceIds
    }
  ]);

  console.log('Created 3 Hindi & Punjabi featured albums.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
