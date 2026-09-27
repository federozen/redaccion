import * as cheerio from "cheerio";

export async function fetchSource(url:string):Promise<{url:string;title:string;text:string;error?:string}> {
  try {
    const u = new URL(url);
    if (!["http:","https:"].includes(u.protocol)) throw new Error("URL inválida");
    const r = await fetch(url,{headers:{"user-agent":"Mozilla/5.0 RedaccionMesa/1.0"},redirect:"follow",signal:AbortSignal.timeout(9000)});
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const html = await r.text();
    const $ = cheerio.load(html);
    $("script,style,noscript,svg,nav,footer,aside,form").remove();
    const title = ($("meta[property='og:title']").attr("content") || $("title").text() || u.hostname).trim();
    const paras = $("article p, main p, p").map((_,el)=>$(el).text().replace(/\s+/g," ").trim()).get().filter(t=>t.length>45);
    return {url,title,text:paras.slice(0,35).join("\n\n").slice(0,18000)};
  } catch (e:any) {
    return {url,title:url,text:"",error:e?.message || "No se pudo leer"};
  }
}
