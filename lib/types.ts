export type Trigger = "breaking"|"noticia"|"declaraciones"|"mercado"|"previa"|"post"|"actualizacion"|"analisis";
export type Risk = "bajo"|"medio"|"alto";
export type ModelTier = "free_fast"|"free_strong"|"premium";

export type EditorialAnalysis = {
  trigger: Trigger;
  label: string;
  headline: string;
  summary: string;
  protagonists: string[];
  confirmedFacts: string[];
  openQuestions: string[];
  cautions: string[];
  suggestedAngles: string[];
  section: string;
  tags: string[];
  complexity: number;
  risk: Risk;
  recommendedTier: ModelTier;
  reason: string;
};

export type Article = {
  title: string;
  deck: string;
  body: string;
  section: string;
  tags: string[];
  alternatives: {kind:string; title:string; score:number; notes:string[]}[];
  review: {approved:boolean; warnings:string[]; checks:string[]};
  model: {provider:string; model:string; tier:ModelTier};
};
