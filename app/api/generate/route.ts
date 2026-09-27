import { NextResponse } from "next/server";
import { z } from "zod";
import { runModel } from "@/lib/models";
import { WRITE_SYSTEM, REVIEW_SYSTEM } from "@/lib/prompts";
import { parseJson } from "@/lib/json";
import type { Article, EditorialAnalysis, ModelTier } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const Req = z.object({
  input:z.string().min(5).max(30000), context:z.string().max(10000).default(""),
  analysis:z.any(), forceTier:z.enum(["auto","free_fast","free_strong","premium"]).default("auto")
});

function tierFrom(a:EditorialAnalysis, force:string):ModelTier {
  if (force !== "auto") return force as ModelTier;
  return a.recommendedTier || (a.complexity >= 6 ? "premium" : a.complexity >= 3 ? "free_strong" : "free_fast");
}

export async function POST(req:Request) {
  try {
    const body = Req.parse(await req.json());
    const a = body.analysis as EditorialAnalysis;
    const tier = tierFrom(a,body.forceTier);
    const facts = `DISPARADOR ORIGINAL:\n${body.input}\n\nMESA EDITORIAL:\n${JSON.stringify(a,null,2)}\n\nCONTEXTO DEL PERIODISTA:\n${body.context || "(sin contexto adicional)"}`;
    let draft = await runModel(tier,[{role:"system",content:WRITE_SYSTEM},{role:"user",content:facts}]);
    let article = parseJson<any>(draft.text);
    let review = await runModel(tier === "free_fast" ? "free_fast" : "free_strong",[
      {role:"system",content:REVIEW_SYSTEM},
      {role:"user",content:`MESA:\n${JSON.stringify(a,null,2)}\n\nBORRADOR:\n${JSON.stringify(article,null,2)}`}
    ]);
    let verdict = parseJson<any>(review.text);
    if (!verdict.approved && verdict.revisionInstruction) {
      draft = await runModel(tier,[{role:"system",content:WRITE_SYSTEM},{role:"user",content:`${facts}\n\nREVISIÓN EDITORIAL OBLIGATORIA:\n${verdict.revisionInstruction}\nReescribí corrigiendo sólo lo señalado.`}]);
      article = parseJson<any>(draft.text);
      review = await runModel("free_fast",[{role:"system",content:REVIEW_SYSTEM},{role:"user",content:`MESA:\n${JSON.stringify(a,null,2)}\n\nBORRADOR REVISADO:\n${JSON.stringify(article,null,2)}`}]);
      verdict = parseJson<any>(review.text);
    }
    const result:Article = {
      title:article.title||"", deck:article.deck||"", body:article.body||"", section:article.section||a.section,
      tags:Array.isArray(article.tags)?article.tags:a.tags,
      alternatives:Array.isArray(article.alternatives)?article.alternatives:[],
      review:{approved:!!verdict.approved,warnings:verdict.warnings||[],checks:verdict.checks||[]},
      model:{provider:draft.provider,model:draft.model,tier}
    };
    return NextResponse.json({article:result});
  } catch (e:any) {
    return NextResponse.json({error:e?.message || "No se pudo generar"},{status:400});
  }
}
