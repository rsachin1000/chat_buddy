import fs from "fs";

import { APIPromise } from "openai/core";
import { Response } from "openai/src/_shims/index";
import { Transcription } from "openai/resources/audio/transcriptions";

import openai from "@/lib/openai/client";

export interface SpeechParams {
  text: string;
  model?: "tts-1" | "tts-1-hd";
  voice?: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  response_format?: "mp3" | "opus" | "aac" | "flac";
  speed?: number;
}

export function GenerateSpeech({
  text,
  model = "tts-1",
  voice = "alloy",
  response_format = "mp3",
  speed = 1.0,
}: SpeechParams): APIPromise<Response> {
  const response = openai.audio.speech.create({
    input: text,
    model: model,
    voice: voice,
    response_format: response_format,
    speed: speed,
  });
  return response;
}

export interface TranscriptionParams {
  filePath: string;
  model?: "whisper-1";
  language?: string;
  response_format?: "json" | "text" | "srt" | "verbose_json" | "vtt";
  temperature?: number;
}

export function GenerateText({
  filePath,
  language = "en",
  model = "whisper-1",
  response_format = "text",
  temperature = 0.0,
}: TranscriptionParams): APIPromise<Transcription> {
  const response = openai.audio.transcriptions.create({
    file: fs.createReadStream(filePath),
    model: model,
    language: language,
    response_format: response_format,
    temperature: temperature,
  });

  return response;
}
