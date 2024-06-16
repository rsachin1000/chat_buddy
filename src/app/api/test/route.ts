import { NextResponse } from "next/server";
import { GenerateSpeech } from "@/lib/openai/speech";

export const dynamic = true;
export const runtime = "edge";

export async function GET() {
  const inputText = `This foreign threat exacerbated France's political turmoil amid the French Revolution and deepened the passion and sense of urgency among the various factions. In the insurrection of 10 August 1792, citizens stormed the Tuileries Palace, killing six hundred of the King's Swiss guards and insisting on the removal of the king.
  A renewed fear of anti-revolutionary action prompted further violence, and in the first week of September 1792, mobs of Parisians broke into the city's prisons. They killed over half of the prisoners, including nobles, clergymen, and political prisoners, but also common criminals, such as prostitutes and petty thieves. Many victims were murdered in their cells: raped, stabbed, and/or slashed to death. This became known as the September Massacres`;

  const response = await GenerateSpeech({ text: inputText });
  const stream = response.body;

  const res = new NextResponse(stream, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Transfer-Encoding": "chunked",
    },
  });

  return res;
}
