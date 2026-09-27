import { NextResponse } from "next/server";
import { z } from "zod";
import { runModel } from "@/lib/models";
import { ANALYZE_SYSTEM } from "@/lib/prompts";
import { parseJson } from "@/lib/json";
import { fetchSource } from "@/lib/source";
import type { EditorialAnalysis } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const Req = z.object({input:z.string().min(5).max(30000),urls:z.array(z.string().url()).max(6).default([]),context:z.string().max(10000).default("")});

export async function POST(req:Request) {
  try {
    const body = Req.parse(await req.json());
    const sources = await Promise.all(body.urls.map(fetchSource));
    const sourceText = sources.map((s,i)=>`FUENTE ${i+1}\nURL: ${s.url}\nTítulo: ${s.title}\n${s.error?`ERROR: ${s.error}`:s.text}`).join("\n\n---\n\n");
    const user = `DISPARADOR DEL PERIODISTA:\n${body.input}\n\nCONTEXTO OPCIONAL:\n${body.context || "(sin contexto adicional)"}\n\nFUENTES LEÍDAS:\n${sourceText || "(sin URLs)"}\n\nDevolvé JSON con: trigger,label,headline,summary,protagonists,confirmedFacts,openQuestions,cautions,suggestedAngles,section,tags,complexity,risk,recommendedTier,reason.`;
    const out = await runModel("free_fast",[{role:"system",content:ANALYZE_SYSTEM},{role:"user",content:user}]);
    const analysis = parseJson<EditorialAnalysis>(out.text);
    return NextResponse.json({analysis,sources,model:{provider:out.provider,model:out.model}});
  } catch (e:any) {
    return NextResponse.json({error:e?.message || "No se pudo analizar"},{status:400});
  }
}
