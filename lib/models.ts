import { ModelTier } from "./types";

type Message = {role:"system"|"user"|"assistant"; content:string};

export type ModelResult = {text:string; provider:string; model:string};

const env = (name:string, fallback="") => process.env[name]?.trim() || fallback;

async function gemini(messages:Message[], model:string):Promise<ModelResult> {
  const key = env("GEMINI_API_KEY");
  if (!key) throw new Error("Falta GEMINI_API_KEY");
  const system = messages.filter(m=>m.role==="system").map(m=>m.content).join("\n\n");
  const contents = messages.filter(m=>m.role!=="system").map(m=>({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{text:m.content}]
  }));
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
    method:"POST", headers:{"content-type":"application/json"},
    body:JSON.stringify({systemInstruction:{parts:[{text:system}]},contents,generationConfig:{temperature:0.25,responseMimeType:"application/json"}})
  });
  if (!r.ok) throw new Error(`Gemini ${r.status}: ${(await r.text()).slice(0,240)}`);
  const d = await r.json();
  const text = d?.candidates?.[0]?.content?.parts?.map((p:any)=>p.text||"").join("")?.trim();
  if (!text) throw new Error("Gemini no devolvió texto");
  return {text, provider:"Gemini", model};
}

async function groq(messages:Message[], model:string):Promise<ModelResult> {
  const key = env("GROQ_API_KEY");
  if (!key) throw new Error("Falta GROQ_API_KEY");
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method:"POST", headers:{"content-type":"application/json","authorization":`Bearer ${key}`},
    body:JSON.stringify({model,messages,temperature:0.2,response_format:{type:"json_object"}})
  });
  if (!r.ok) throw new Error(`Groq ${r.status}: ${(await r.text()).slice(0,240)}`);
  const d = await r.json();
  const text = d?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error("Groq no devolvió texto");
  return {text, provider:"Groq", model};
}

async function anthropic(messages:Message[], model:string):Promise<ModelResult> {
  const key = env("ANTHROPIC_API_KEY");
  if (!key) throw new Error("Falta ANTHROPIC_API_KEY");
  const system = messages.filter(m=>m.role==="system").map(m=>m.content).join("\n\n");
  const clean = messages.filter(m=>m.role!=="system");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"content-type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01"},
    body:JSON.stringify({model,max_tokens:5000,temperature:0.2,system,messages:clean})
  });
  if (!r.ok) throw new Error(`Anthropic ${r.status}: ${(await r.text()).slice(0,240)}`);
  const d = await r.json();
  const text = d?.content?.filter((x:any)=>x.type==="text").map((x:any)=>x.text).join("\n")?.trim();
  if (!text) throw new Error("Anthropic no devolvió texto");
  return {text, provider:"Anthropic", model};
}

export async function runModel(tier:ModelTier, messages:Message[]):Promise<ModelResult> {
  const fast = env("FREE_FAST_PROVIDER","gemini");
  const strong = env("FREE_STRONG_PROVIDER","groq");
  if (tier === "premium" && process.env.ANTHROPIC_API_KEY) {
    return anthropic(messages, env("PREMIUM_MODEL","claude-sonnet-5"));
  }
  if (tier === "free_strong") {
    if (strong === "groq" && process.env.GROQ_API_KEY) return groq(messages, env("GROQ_STRONG_MODEL","openai/gpt-oss-120b"));
    if (process.env.GEMINI_API_KEY) return gemini(messages, env("GEMINI_STRONG_MODEL","gemini-3.8-flash"));
  }
  if (fast === "gemini" && process.env.GEMINI_API_KEY) return gemini(messages, env("GEMINI_FAST_MODEL","gemini-3.5-flash-lite"));
  if (process.env.GROQ_API_KEY) return groq(messages, env("GROQ_FAST_MODEL","openai/gpt-oss-20b"));
  if (process.env.ANTHROPIC_API_KEY) return anthropic(messages, env("PREMIUM_MODEL","claude-sonnet-5"));
  throw new Error("No hay ningún proveedor de IA configurado. Agregá GEMINI_API_KEY, GROQ_API_KEY o ANTHROPIC_API_KEY.");
}
