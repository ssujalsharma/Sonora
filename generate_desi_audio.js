const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, 'spotify-frontend', 'public', 'audio');
fs.mkdirSync(outputDir, { recursive: true });

function createMusicalTrack({ filename, bpm = 110, chords = [261.63, 293.66, 329.63, 392.00], style = "pop", duration = 30 }) {
  const sampleRate = 22050;
  const numChannels = 1;
  const numSamples = Math.floor(sampleRate * duration);
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // WAV Header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const beat = (t * bpm / 60);
    const chordIdx = Math.floor(beat / 4) % chords.length;
    const root = chords[chordIdx];

    let sampleVal = 0;

    if (style === "bhangra") {
      // Dhol beat rhythm (heavy punch on 1 and 3, syncopated rolls)
      const dhol = Math.exp(-25 * (beat % 0.5)) * Math.sin(2 * Math.PI * 75 * (beat % 0.5)) * 0.45;
      const bass = Math.sin(2 * Math.PI * (root / 2) * t) * 0.35;
      // Tumbi / High lead hook
      const lead = Math.sin(2 * Math.PI * (root * 2) * t + Math.sin(2 * Math.PI * 8 * t) * 0.2) * 0.25;
      const clap = (beat % 1 > 0.45 && beat % 1 < 0.55) ? (Math.random() - 0.5) * 0.2 : 0;
      sampleVal = dhol + bass + lead + clap;
    } else if (style === "romantic") {
      // Soft acoustic arpeggio + warm bass + melodic flute/pad
      const noteOffset = Math.floor((beat * 2) % 4);
      const noteFreq = root * [1, 1.25, 1.5, 2][noteOffset];
      const arp = Math.sin(2 * Math.PI * noteFreq * t) * Math.exp(-3 * (beat % 0.5)) * 0.35;
      const pad = Math.sin(2 * Math.PI * root * t) * 0.2 + Math.sin(2 * Math.PI * (root * 1.5) * t) * 0.15;
      const bass = Math.sin(2 * Math.PI * (root / 2) * t) * 0.25;
      sampleVal = arp + pad + bass;
    } else if (style === "trap") {
      // 808 sub bass + fast hi-hat + synth hook
      const kick = Math.exp(-15 * (beat % 1)) * Math.sin(2 * Math.PI * 55 * Math.exp(-10 * (beat % 1))) * 0.5;
      const hat = ((beat * 4) % 1 < 0.2) ? (Math.random() - 0.5) * 0.15 : 0;
      const lead = Math.sin(2 * Math.PI * root * t) * 0.22 + Math.sin(2 * Math.PI * (root * 1.33) * t) * 0.15;
      sampleVal = kick + hat + lead;
    } else {
      // Upbeat Bollywood Pop
      const kick = Math.exp(-25 * (beat % 1)) * Math.sin(2 * Math.PI * 80 * (beat % 1)) * 0.4;
      const snare = (beat % 2 > 0.95 && beat % 2 < 1.05) ? (Math.random() - 0.5) * 0.3 : 0;
      const bass = Math.sin(2 * Math.PI * (root / 2) * t) * 0.3;
      const synth = Math.sin(2 * Math.PI * root * t) * 0.25;
      sampleVal = kick + snare + bass + synth;
    }

    sampleVal = Math.max(-0.95, Math.min(0.95, sampleVal));
    buffer.writeInt16LE(Math.floor(sampleVal * 32767), offset);
    offset += 2;
  }

  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Wrote ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

// 8 Hindi Tracks
createMusicalTrack({ filename: 'kesariya.wav', bpm: 86, chords: [261.63, 329.63, 392.00, 349.23], style: "romantic", duration: 32 });
createMusicalTrack({ filename: 'apna_bana_le.wav', bpm: 82, chords: [220.00, 261.63, 329.63, 293.66], style: "romantic", duration: 30 });
createMusicalTrack({ filename: 'tum_hi_ho.wav', bpm: 78, chords: [220.00, 174.61, 261.63, 196.00], style: "romantic", duration: 34 });
createMusicalTrack({ filename: 'raataan_lambiyan.wav', bpm: 88, chords: [261.63, 329.63, 220.00, 349.23], style: "romantic", duration: 30 });
createMusicalTrack({ filename: 'chaleya.wav', bpm: 122, chords: [293.66, 369.99, 440.00, 329.63], style: "pop", duration: 30 });
createMusicalTrack({ filename: 'tere_vaaste.wav', bpm: 112, chords: [261.63, 293.66, 329.63, 392.00], style: "pop", duration: 30 });
createMusicalTrack({ filename: 'pehle_bhi_main.wav', bpm: 90, chords: [220.00, 261.63, 329.63, 196.00], style: "romantic", duration: 30 });
createMusicalTrack({ filename: 'shayad.wav', bpm: 84, chords: [261.63, 392.00, 220.00, 349.23], style: "romantic", duration: 32 });

// 8 Punjabi Tracks
createMusicalTrack({ filename: 'brown_munde.wav', bpm: 104, chords: [174.61, 220.00, 196.00, 246.94], style: "trap", duration: 32 });
createMusicalTrack({ filename: 'lover.wav', bpm: 124, chords: [261.63, 329.63, 392.00, 349.23], style: "bhangra", duration: 30 });
createMusicalTrack({ filename: 'softly.wav', bpm: 96, chords: [220.00, 261.63, 329.63, 293.66], style: "trap", duration: 30 });
createMusicalTrack({ filename: '295.wav', bpm: 94, chords: [196.00, 246.94, 220.00, 174.61], style: "trap", duration: 32 });
createMusicalTrack({ filename: 'born_to_shine.wav', bpm: 126, chords: [293.66, 349.23, 440.00, 392.00], style: "bhangra", duration: 30 });
createMusicalTrack({ filename: 'excuses.wav', bpm: 98, chords: [220.00, 261.63, 196.00, 174.61], style: "trap", duration: 30 });
createMusicalTrack({ filename: 'tauba_tauba.wav', bpm: 128, chords: [261.63, 329.63, 392.00, 293.66], style: "bhangra", duration: 30 });
createMusicalTrack({ filename: 'goat.wav', bpm: 102, chords: [196.00, 220.00, 261.63, 174.61], style: "trap", duration: 32 });

console.log('All 16 Hindi & Punjabi musical tracks successfully generated!');
