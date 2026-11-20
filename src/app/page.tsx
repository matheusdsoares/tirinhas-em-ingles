"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpen, Check, ChevronDown, CircleHelp, Clock3, Loader2, MessageCircle,
  RotateCcw, Sparkles, Volume2, WandSparkles, Languages
} from "lucide-react";
import { ComicCard } from "@/components/ComicCard";
import { addVocabularyWords, readVocabulary, type VocabularyItem } from "@/lib/storage";
import type { Cenario, Nivel, Tirinha } from "@/types";

const scenarios: Cenario[] = [
  "No restaurante",
  "Chegando no trabalho",
  "Saindo do trabalho",
  "Pedindo informação",
  "Na cafeteria",
  "No supermercado",
  "No aeroporto",
  "Cenário aleatório"
];

export default function HomePage() {
  const [cenario, setCenario] = useState<Cenario>("No restaurante");
  const [nivel, setNivel] = useState<Nivel>("simples");
  const [tirinha, setTirinha] = useState<Tirinha | null>(null);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWords, setShowWords] = useState(false);

  useEffect(() => {
    setVocabulary(readVocabulary());
  }, []);

  const practicedCount = useMemo(
    () => vocabulary.reduce((sum, item) => sum + item.count, 0),
    [vocabulary]
  );

  async function generateComic() {
    setLoading(true);
    setError("");
    setShowWords(false);
    const recurringWords = vocabulary.slice(0, 5).map((item) => item.word);

    try {
      const response = await fetch("/api/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cenario, nivel, palavrasRecorrentes: recurringWords })
      });

      const data: unknown = await response.json();
      if (!response.ok) {
        const message = typeof data === "object" && data && "error" in data
          ? String(data.error)
          : "Não foi possível gerar a tirinha.";
        throw new Error(message);
      }

      const generated = data as Tirinha;
      setTirinha(generated);
      const updated = addVocabularyWords(generated.palavras_chave_novas);
      setVocabulary(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function clearVocabulary() {
    if (!window.confirm("Deseja apagar seu histórico de palavras deste navegador?")) return;
    window.localStorage.removeItem("tirinhas-ingles:vocabulary");
    setVocabulary([]);
  }

  return (
    <main className="min-h-screen pb-16">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
              <BookOpen size={23} />
            </div>
            <div>
              <p className="text-lg font-black tracking-tight text-slate-900">Tirinhas em Inglês</p>
              <p className="text-xs font-semibold text-slate-500">Pequenas histórias. Grandes aprendizados.</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-extrabold text-amber-700 sm:flex">
            <Sparkles size={15} /> Aprenda no seu ritmo
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-10">
        <section className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="overflow-hidden rounded-[30px] bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-600 p-6 text-white shadow-soft sm:p-8">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-extrabold">
                  <WandSparkles size={14} /> SUA PRÓXIMA AVENTURA EM INGLÊS
                </span>
                <h1 className="mt-4 text-3xl font-black leading-tight sm:text-4xl">
                  Aprenda inglês com histórias do dia a dia!
                </h1>
                <p className="mt-3 max-w-lg text-sm font-medium leading-6 text-violet-100 sm:text-base">
                  Leia, escute e descubra o significado de cada palavra. O vocabulário que você já viu aparece novamente nas próximas histórias.
                </p>
              </div>
              <div className="hidden shrink-0 text-7xl sm:block" aria-hidden="true">💬</div>
            </div>
          </div>

          <aside className="rounded-[30px] border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <Languages size={20} />
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">Seu progresso</span>
            </div>
            <p className="mt-4 text-3xl font-black text-slate-900">{practicedCount}</p>
            <p className="text-sm font-bold text-slate-600">práticas de palavras</p>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
              <span className="font-semibold text-slate-500">{vocabulary.length} palavras no histórico</span>
              <button onClick={() => setShowWords((v) => !v)} className="font-extrabold text-violet-700 hover:text-violet-900">
                {showWords ? "Fechar" : "Ver palavras"}
              </button>
            </div>
            {showWords && (
              <div className="mt-3 flex flex-wrap gap-2">
                {vocabulary.length ? vocabulary.map((item) => (
                  <span key={item.word} className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700">
                    {item.word} <span className="text-violet-400">×{item.count}</span>
                  </span>
                )) : <p className="text-xs text-slate-500">Gere sua primeira tirinha para começar.</p>}
              </div>
            )}
          </aside>
        </section>

        <section className="mt-8 rounded-[28px] border border-slate-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              <label htmlFor="scenario" className="mb-2 block text-sm font-black text-slate-800">Onde a história vai acontecer?</label>
              <div className="relative">
                <select
                  id="scenario"
                  value={cenario}
                  onChange={(event) => setCenario(event.target.value as Cenario)}
                  className="w-full appearance-none rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 pr-11 text-sm font-bold text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white"
                >
                  {scenarios.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              </div>
            </div>

            <div className="md:w-[310px]">
              <span className="mb-2 block text-sm font-black text-slate-800">Escolha seu nível</span>
              <div className="grid grid-cols-2 rounded-2xl bg-slate-100 p-1.5">
                <button
                  onClick={() => setNivel("simples")}
                  className={`rounded-xl px-3 py-2.5 text-sm font-black transition ${nivel === "simples" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                >
                  🌱 Simples
                </button>
                <button
                  onClick={() => setNivel("medio")}
                  className={`rounded-xl px-3 py-2.5 text-sm font-black transition ${nivel === "medio" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                >
                  🚀 Médio
                </button>
              </div>
            </div>

            <button
              onClick={generateComic}
              disabled={loading}
              className="flex min-h-[50px] items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 md:min-w-[190px]"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> Criando...</> : <><Sparkles size={18} /> Gerar tirinha</>}
            </button>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-500" /> 4 quadros por história</span>
            <span className="flex items-center gap-1.5"><RotateCcw size={14} className="text-violet-500" /> Revisão de palavras anteriores</span>
            <span className="flex items-center gap-1.5"><Volume2 size={14} className="text-sky-500" /> Áudio em inglês</span>
          </div>
        </section>

        {error && (
          <div role="alert" className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-8 rounded-[28px] border border-violet-100 bg-white p-10 text-center shadow-soft">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-violet-100 text-violet-700">
              <MessageCircle size={30} className="animate-pulse" />
            </div>
            <p className="mt-4 text-lg font-black text-slate-800">Preparando sua história...</p>
            <p className="mt-1 text-sm text-slate-500">Estamos criando um diálogo e revisando seu vocabulário.</p>
          </div>
        )}

        {!tirinha && !loading && (
          <section className="mt-8 rounded-[28px] border-2 border-dashed border-slate-200 bg-white/70 px-6 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-100 text-3xl">📚</div>
            <h2 className="mt-4 text-xl font-black text-slate-800">Sua primeira tirinha está esperando!</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Escolha uma situação, selecione seu nível e clique em “Gerar tirinha”. Você poderá ouvir cada frase e tocar em qualquer palavra para descobrir seu significado.
            </p>
          </section>
        )}

        {tirinha && !loading && (
          <section className="mt-9">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-violet-600">
                  <Clock3 size={14} /> Sua história
                </div>
                <h2 className="mt-1 text-2xl font-black text-slate-900">{tirinha.cenario}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Nível {tirinha.nivel === "simples" ? "simples" : "médio"} · 4 quadros · Toque nas palavras para explorar
                </p>
              </div>
              <button
                onClick={generateComic}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-xs font-black text-violet-700 transition hover:bg-violet-50 sm:self-auto"
              >
                <RotateCcw size={15} /> Criar outra história
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              {tirinha.quadros.map((quadro) => <ComicCard key={quadro.numero} quadro={quadro} />)}
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-[24px] border border-violet-100 bg-violet-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-black text-violet-900">✨ Palavras para levar com você</p>
                <p className="mt-1 text-xs font-semibold text-violet-700">Estas palavras foram adicionadas ao seu histórico de revisão.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {tirinha.palavras_chave_novas.map((word) => (
                    <span key={word} className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-xs font-extrabold text-violet-800">{word}</span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-violet-700">
                <CircleHelp size={16} /> Sublinhado pontilhado = palavra revisada
              </div>
            </div>
          </section>
        )}

        <footer className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-slate-200 py-6 text-center text-xs font-semibold text-slate-400 sm:flex-row sm:text-left">
          <p>Feito para aprender um pouquinho todos os dias 💜</p>
          <button onClick={clearVocabulary} className="hover:text-rose-600">Limpar histórico deste navegador</button>
        </footer>
      </div>
    </main>
  );
}
