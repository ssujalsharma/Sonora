const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();
const connectDB = require('./src/db/db');
const userModel = require('./src/models/user.model');
const musicModel = require('./src/models/music.model');
const albumModel = require('./src/models/album.model');
const bcrypt = require('bcryptjs');

const audioDir = path.join(__dirname, '..', 'spotify-frontend', 'public', 'audio');
const coversDir = path.join(__dirname, '..', 'spotify-frontend', 'public', 'covers');
fs.mkdirSync(audioDir, { recursive: true });
fs.mkdirSync(coversDir, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadFile(response.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

const songDefs = [
  // --- HINDI SONGS ---
  {
    key: 'kesariya',
    q: 'Kesariya Arijit Singh',
    fallbackTitle: 'Kesariya',
    artistName: 'Arijit Singh',
    language: 'Hindi',
    genre: 'Bollywood Romance',
    color: '#ff7700'
  },
  {
    key: 'apna_bana_le',
    q: 'Apna Bana Le Arijit Singh',
    fallbackTitle: 'Apna Bana Le',
    artistName: 'Arijit Singh',
    language: 'Hindi',
    genre: 'Bollywood Romance',
    color: '#6c5ce7'
  },
  {
    key: 'tum_hi_ho',
    q: 'Tum Hi Ho Arijit Singh',
    fallbackTitle: 'Tum Hi Ho',
    artistName: 'Arijit Singh',
    language: 'Hindi',
    genre: 'Bollywood Classic',
    color: '#0984e3'
  },
  {
    key: 'raataan_lambiyan',
    q: 'Raataan Lambiyan Jubin Nautiyal',
    fallbackTitle: 'Raataan Lambiyan',
    artistName: 'Pritam',
    language: 'Hindi',
    genre: 'Bollywood Romance',
    color: '#a29bfe'
  },
  {
    key: 'chaleya',
    q: 'Chaleya Arijit Singh',
    fallbackTitle: 'Chaleya',
    artistName: 'Arijit Singh',
    language: 'Hindi',
    genre: 'Bollywood Pop',
    color: '#fdcb6e'
  },
  {
    key: 'tere_vaaste',
    q: 'Tere Vaaste Varun Jain',
    fallbackTitle: 'Tere Vaaste',
    artistName: 'Pritam',
    language: 'Hindi',
    genre: 'Trending Bollywood',
    color: '#55efc4'
  },
  {
    key: 'pehle_bhi_main',
    q: 'Pehle Bhi Main Vishal Mishra',
    fallbackTitle: 'Pehle Bhi Main',
    artistName: 'Pritam',
    language: 'Hindi',
    genre: 'Soulful Hindi',
    color: '#00cec9'
  },
  {
    key: 'shayad',
    q: 'Shayad Arijit Singh',
    fallbackTitle: 'Shayad',
    artistName: 'Arijit Singh',
    language: 'Hindi',
    genre: 'Acoustic Romance',
    color: '#fab1a0'
  },

  // --- PUNJABI SONGS ---
  {
    key: 'brown_munde',
    q: 'Brown Munde AP Dhillon',
    fallbackTitle: 'Brown Munde',
    artistName: 'AP Dhillon',
    language: 'Punjabi',
    genre: 'Punjabi Trap',
    color: '#2a5298'
  },
  {
    key: 'lover',
    q: 'Lover Diljit Dosanjh',
    fallbackTitle: 'Lover',
    artistName: 'Diljit Dosanjh',
    language: 'Punjabi',
    genre: 'Punjabi Pop',
    color: '#e84393'
  },
  {
    key: 'softly',
    q: 'Softly Karan Aujla',
    fallbackTitle: 'Softly',
    artistName: 'Karan Aujla',
    language: 'Punjabi',
    genre: 'Punjabi R&B',
    color: '#00b894'
  },
  {
    key: '295',
    q: '295 Sidhu Moose Wala',
    fallbackTitle: '295',
    artistName: 'Sidhu Moose Wala',
    language: 'Punjabi',
    genre: 'Punjabi Hip-Hop',
    color: '#d63031'
  },
  {
    key: 'born_to_shine',
    q: 'Born to Shine Diljit Dosanjh',
    fallbackTitle: 'Born to Shine',
    artistName: 'Diljit Dosanjh',
    language: 'Punjabi',
    genre: 'Bhangra Pop',
    color: '#e17055'
  },
  {
    key: 'excuses',
    q: 'Excuses AP Dhillon',
    fallbackTitle: 'Excuses',
    artistName: 'AP Dhillon',
    language: 'Punjabi',
    genre: 'Punjabi Lo-Fi',
    color: '#6c5ce7'
  },
  {
    key: 'tauba_tauba',
    q: 'Tauba Tauba Karan Aujla',
    fallbackTitle: 'Tauba Tauba',
    artistName: 'Karan Aujla',
    language: 'Punjabi',
    genre: 'Bhangra Dance',
    color: '#fd79a8'
  },
  {
    key: 'goat',
    q: 'G.O.A.T. Diljit Dosanjh',
    fallbackTitle: 'G.O.A.T.',
    artistName: 'Diljit Dosanjh',
    language: 'Punjabi',
    genre: 'Punjabi Anthem',
    color: '#ffeaa7'
  }
];

async function main() {
  await connectDB();
  console.log('Connected to MongoDB.');

  const defaultPasswordHash = await bcrypt.hash('artist123', 10);
  const artistMap = {};

  async function getArtist(name) {
    if (artistMap[name]) return artistMap[name];
    let artist = await userModel.findOne({ username: name });
    if (!artist) {
      artist = await userModel.create({
        username: name,
        email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@sonora.fm`,
        password: defaultPasswordHash,
        role: 'artist'
      });
    }
    artistMap[name] = artist;
    return artist;
  }

  // Pre-load all artists
  for (const item of songDefs) {
    await getArtist(item.artistName);
  }

  // Clear existing tracks & albums
  await musicModel.deleteMany({});
  await albumModel.deleteMany({});
  console.log('Cleaned old tracks and albums.');

  const insertedSongs = [];

  for (const item of songDefs) {
    console.log(`Fetching real audio for: ${item.fallbackTitle}...`);
    try {
      const itunesRes = await fetch(
        'https://itunes.apple.com/search?term=' + encodeURIComponent(item.q) + '&entity=song&limit=1'
      );
      const data = await itunesRes.json();
      const match = data.results && data.results[0];

      let audioFileName = `${item.key}.m4a`;
      let coverFileName = `${item.key}.jpg`;
      let audioPath = path.join(audioDir, audioFileName);
      let coverPath = path.join(coversDir, coverFileName);

      let finalAudioUri = `/audio/${audioFileName}`;
      let finalCoverUri = `/covers/${coverFileName}`;

      if (match && match.previewUrl) {
        await downloadFile(match.previewUrl, audioPath);
        console.log(`Downloaded real audio preview for ${item.fallbackTitle} (${fs.statSync(audioPath).size} bytes)`);

        if (match.artworkUrl100) {
          const highResArt = match.artworkUrl100.replace('100x100bb', '600x600bb');
          await downloadFile(highResArt, coverPath).catch(() => {});
        }
      } else {
        console.log(`Using fallback audio for ${item.fallbackTitle}`);
        audioFileName = `${item.key}.wav`;
        finalAudioUri = `/audio/${audioFileName}`;
      }

      const artistDoc = await getArtist(item.artistName);

      const songDoc = await musicModel.create({
        title: item.fallbackTitle,
        uri: finalAudioUri,
        artist: artistDoc._id,
        artwork: fs.existsSync(coverPath) ? finalCoverUri : null,
        language: item.language,
        genre: item.genre,
        color: item.color
      });

      insertedSongs.push(songDoc);
    } catch (err) {
      console.error(`Error processing ${item.fallbackTitle}:`, err.message);
    }
  }

  console.log(`Successfully created ${insertedSongs.length} real Hindi & Punjabi tracks!`);

  // Create 3 Curated Albums
  const arijit = await getArtist('Arijit Singh');
  const diljit = await getArtist('Diljit Dosanjh');
  const pritam = await getArtist('Pritam');

  const hindiRomanticIds = insertedSongs.slice(0, 4).map(s => s._id);
  const punjabiWaveIds = insertedSongs.slice(8, 16).map(s => s._id);
  const hindiDanceIds = insertedSongs.slice(4, 8).map(s => s._id);

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
      musics: hindiDanceIds
    }
  ]);

  console.log('Created 3 featured albums with real tracks.');
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
