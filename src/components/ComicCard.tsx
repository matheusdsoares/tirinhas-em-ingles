"use client";

import { Headphones, Volume2 } from "lucide-react";
import { WordButton } from "@/components/WordButton";
import { speak } from "@/lib/speech";
import type { Quadro } from "@/types";

const palettes = [
  { bg: "bg-[#fff0e8]", border: "border-[#f5d6c8]", tag: "bg-[#ffe0d1]", accent: "text-[#b65d3e]" },
  { bg: "bg-[#eaf5ff]", border: "border-[#d2e7f8]", tag: "bg-[#d9edff]", accent: "text-[#3976a8]" },
  { bg: "bg-[#f1edff]", border: "border-[#e1d9fb]", tag: "bg-[#e5ddff]", accent: "text-[#7058b5]" },
  { bg: "bg-[#eaf8ef]", border: "border-[#d5ecdc]", tag: "bg-[#d9f1e1]", accent: "text-[#43845b]" }
];

interface Props { quadro: Quadro; }

export function ComicCard({ quadro }: Props) {
  const palette = palettes[(quadro.numero - 1) % palettes.length];
  const isA = quadro.papel === "personagem_a";

  return (
    <article className={`relative flex min-h-[250px] flex-col overflow-visible rounded-[28px] border-2 ${palette.border} ${palette.bg} p-5 shadow-soft sm:p-6`}>
      <div className="flex items-center justify-between">
        <span className={`rounded-full ${palette.tag} px-3 py-1 text-xs font-black ${palette.accent}`}>
          QUADRO {quadro.numero}
        </span>
        <button
          type="button"
          onClick={() => speak(quadro.frase_completa_en)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm transition hover:scale-105 hover:bg-white"
          aria-label={`Ouvir frase do quadro ${quadro.numero}`}
          title="Ouvir frase inteira"
        >
          <Volume2 size={19} />
        </button>
      </div>

      <div className={`mt-5 flex items-center gap-3 ${isA ? "" : "flex-row-reverse"}`}>
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${isA ? "bg-white text-orange-500" : "bg-white text-blue-500"} shadow-sm`}>
          <span className="text-2xl" aria-hidden="true">{isA ? "🧑‍🍳" : "🧑‍💼"}</span>
        </div>
        <div className={isA ? "text-left" : "text-right"}>
          <p className="text-sm font-black text-slate-800">{quadro.personagem}</p>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            {isA ? "Personagem A" : "Personagem B"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/80 bg-white/75 px-4 py-4 shadow-sm">
        <p className="text-[1.08rem] leading-8">
          {quadro.palavras.map((word, index) => (
            <WordButton key={`${quadro.numero}-${index}-${word.texto}`} word={word} />
          ))}
        </p>
        <div className="mt-3 border-t border-slate-200/70 pt-3">
          <p className="text-sm font-semibold leading-relaxed text-slate-600">
            {quadro.traducao_livre_pt}
          </p>
        </div>
      </div>
      <div className="mt-auto flex items-center gap-1.5 pt-4 text-[11px] font-bold text-slate-500">
        <Headphones size={13} />
        Toque nas palavras para ouvir e traduzir
      </div>
    </article>
  );
}
