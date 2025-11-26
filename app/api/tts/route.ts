// File: app/api/tts/route.ts
// This Route Handler securely generates speech on the server.
// The client will 'fetch' this route with text, and it will
// stream back the audio.
import { generateSpeech } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text) {
      return NextResponse.json(
        { error: 'Text is required.' },
        { status: 400 }
      );
    }

    // Generate the speech data from our Gemini lib
    const { audioData, sampleRate } = await generateSpeech(text);

    // Return the base64 audio and sample rate
    return NextResponse.json({
      audioData, // This is a base64 string
      sampleRate,
    });
  } catch (error) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech.' },
      { status: 500 }
    );
  }
}