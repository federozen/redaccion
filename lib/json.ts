export function parseJson<T>(text:string):T {
  const clean = text.replace(/^```(?:json)?\s*/i,"").replace(/\s*```$/i,"").trim();
  return JSON.parse(clean) as T;
}
