"use client";

import * as React from "react";

import { Button } from "@/ui/button";

export default function AudioRecorder() {
  const [recorder, setRecorder] = React.useState<MediaRecorder | null>(null);
  const [message, setMessage] = React.useState<string>("");

  function sendAudioChunk(audioBlob: Blob) {
    const formData = new FormData();
    formData.append("audioChunk", audioBlob);
    fetch("/api/process_chunk", {
      method: "POST",
      body: formData,
    }).then((response) => {
      if (response.ok) {
        response.text().then((text) => {
          setMessage(`Transcription: ${text}`);
        });
      } else {
        setMessage("Error sending audio chunk");
      }
    });
  }

  function startRecording() {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream: MediaStream) => {
        // const options = { audioBitsPerSecond: 64000 };
        const newRecorder = new MediaRecorder(stream);
        newRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            sendAudioChunk(event.data);
          }
        };
        newRecorder.start(10000);
        setRecorder(newRecorder);
      })
      .catch((err: DOMException) => {
        console.log(`Error starting audio recording: ${err.message}`);
        setMessage(
          "Please allow microphone access in order to access this feature"
        );
      });
  }

  const stopRecording = () => {
    recorder?.stop();
  };

  return (
    <div className="flex w-72 flex-col gap-y-4 px-4 py-8">
      <Button
        className="rounded-md bg-violet-900 py-6 text-lg text-gray-100 shadow-md shadow-violet-300 hover:bg-violet-700 hover:text-gray-50"
        size="lg"
        onClick={startRecording}
      >
        Start Recording
      </Button>
      <Button
        className="rounded-md bg-violet-900 py-6 text-lg text-gray-100 shadow-md  shadow-violet-300 hover:bg-violet-700 hover:text-gray-50"
        size="lg"
        onClick={stopRecording}
      >
        Stop Recording
      </Button>
      <p className="text-lg text-red-500">{message}</p>
    </div>
  );
}
