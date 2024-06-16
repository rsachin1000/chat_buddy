import fs from "fs";

import { v4 as uuid } from "uuid";
import { NextRequest, NextResponse } from "next/server";

import { GenerateText } from "@/lib/openai/speech";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const audioBlob = formData.get("audioChunk") as File;
  let buffer = await audioBlob.arrayBuffer();
  let view = new Uint8Array(buffer);

  const filePath = `/tmp/${uuid()}.mp3`;
  fs.writeFileSync(filePath, view);

  const transcription = await GenerateText({ filePath: filePath });
  // console.log(transcription.text);
  // return new NextResponse("Successful translation: " + transcription.text);
  return new NextResponse(transcription.text);
}
