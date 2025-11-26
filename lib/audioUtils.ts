// File: lib/audioUtils.ts
// This file contains crucial client-side helpers to convert the
// raw PCM audio data from the TTS API into a playable WAV file.

/**
 * Converts a Base64 string to an ArrayBuffer.
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Converts raw PCM audio data (L16) to a WAV blob.
 * The Gemini TTS API returns audio/L16;rate=24000
 */
export function pcmToWav(
  pcmData: Int16Array,
  sampleRate: number,
  numChannels: number = 1
): Blob {
  const wavHeader = new ArrayBuffer(44);
  const dataView = new DataView(wavHeader);

  const dataSize = pcmData.length * 2; // 16-bit samples (2 bytes)

  // RIFF header
  dataView.setUint32(0, 0x52494646, false); // "RIFF"
  dataView.setUint32(4, 36 + dataSize, true); // ChunkSize
  dataView.setUint32(8, 0x57415645, false); // "WAVE"

  // "fmt " sub-chunk
  dataView.setUint32(12, 0x666d7420, false); // "fmt "
  dataView.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  dataView.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  dataView.setUint16(22, numChannels, true); // NumChannels
  dataView.setUint32(24, sampleRate, true); // SampleRate
  dataView.setUint32(28, sampleRate * numChannels * 2, true); // ByteRate
  dataView.setUint16(32, numChannels * 2, true); // BlockAlign
  dataView.setUint16(34, 16, true); // BitsPerSample

  // "data" sub-chunk
  dataView.setUint32(36, 0x64617461, false); // "data"
  dataView.setUint32(40, dataSize, true); // Subchunk2Size

  const wavBlob = new Blob([wavHeader, pcmData.buffer as ArrayBuffer], { type: 'audio/wav' });
  return wavBlob;
}