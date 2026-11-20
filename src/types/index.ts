export type Nivel = "simples" | "medio";
export type Cenario =
  | "No restaurante"
  | "Chegando no trabalho"
  | "Saindo do trabalho"
  | "Pedindo informação"
  | "Na cafeteria"
  | "No supermercado"
  | "No aeroporto"
  | "Cenário aleatório";

export interface Palavra {
  texto: string;
  traducao: string;
  repetida: boolean;
}

export interface Quadro {
  numero: number;
  personagem: string;
  papel: "personagem_a" | "personagem_b";
  frase_completa_en: string;
  traducao_livre_pt: string;
  palavras: Palavra[];
}

export interface Tirinha {
  cenario: string;
  nivel: Nivel;
  palavras_chave_novas: string[];
  quadros: Quadro[];
}

export interface GerarRequest {
  cenario: Cenario;
  nivel: Nivel;
  palavrasRecorrentes: string[];
}
