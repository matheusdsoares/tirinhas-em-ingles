"use client";

import { useEffect, useRef, useState } from "react";
import { speak } from "@/lib/speech";
import type { Palavra } from "@/types";

interface Props {
  word: Palavra;
}

export function WordButton({ word }: Props) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  function handleClick() {
    speak(word.texto.replace(/[.,!?;:]+$/g, ""));
    setOpen((value) => !value);
  }

  return (
    <span ref={wrapperRef} className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Ouvir ${word.texto} e ver tradução`}
        aria-expanded={open}
        className={`word-button text-[1.04rem] font-extrabold text-slate-800 ${word.repetida ? "word-repeated" : ""}`}
      >
        {word.texto}
      </button>
      {open && (
        <span className="popover-enter absolute bottom-[calc(100%+12px)] left-1/2 z-30 w-max max-w-48 -translate-x-1/2 rounded-xl bg-slate-900 px-3 py-2 text-center text-xs font-bold text-white shadow-xl">
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-violet-200">
            {word.texto}
          </span>
          <span className="mt-0.5 block text-sm">{word.traducao}</span>
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
        </span>
      )}
    </span>
  );
}
