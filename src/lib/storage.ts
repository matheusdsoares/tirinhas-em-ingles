const STORAGE_KEY = "tirinhas-ingles:vocabulary";
const MAX_WORDS = 15;

export interface VocabularyItem {
  word: string;
  count: number;
  lastSeen: number;
}

export function readVocabulary(): VocabularyItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is VocabularyItem =>
      typeof item?.word === "string" &&
      typeof item?.count === "number" &&
      typeof item?.lastSeen === "number"
    );
  } catch {
    return [];
  }
}

export function saveVocabulary(items: VocabularyItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_WORDS)));
}

export function addVocabularyWords(words: string[]): VocabularyItem[] {
  const current = readVocabulary();
  const map = new Map(current.map((item) => [item.word.toLowerCase(), item]));
  const now = Date.now();

  for (const rawWord of words) {
    const word = rawWord.trim().toLowerCase();
    if (!word || word.length < 2) continue;
    const previous = map.get(word);
    map.set(word, {
      word,
      count: (previous?.count ?? 0) + 1,
      lastSeen: now
    });
  }

  const updated = [...map.values()]
    .sort((a, b) => b.lastSeen - a.lastSeen)
    .slice(0, MAX_WORDS);

  saveVocabulary(updated);
  return updated;
}
