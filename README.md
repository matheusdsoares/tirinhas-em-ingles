# Tirinhas em Inglês

Aplicação educacional com Next.js App Router, TypeScript, Tailwind CSS, Gemini 2.5 Flash e armazenamento local no navegador.

## Requisitos

- Node.js 20.9+ (recomendado Node.js 22)
- Chave da Gemini API: https://aistudio.google.com/app/apikey

## Instalação

```bash
npm install
cp .env.example .env.local
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Edite `.env.local` e informe sua chave:

```env
GEMINI_API_KEY=sua_chave_real
```

Nunca use `NEXT_PUBLIC_` no nome dessa variável. A chave deve permanecer no servidor.

## Executar localmente

```bash
npm run dev
```

Abra http://localhost:3000.

## Build de produção

```bash
npm run build
npm start
```

## Publicar na Vercel

1. Importe o repositório em https://vercel.com/new.
2. Em **Settings → Environment Variables**, crie `GEMINI_API_KEY` com sua chave.
3. Faça o deploy.

O histórico de vocabulário fica no `localStorage` do navegador e é específico daquele navegador/dispositivo.

## Repetição espaçada

A cada geração, o navegador envia até cinco palavras do histórico para `/api/gerar`. O Gemini tenta reutilizá-las naturalmente e o servidor marca as ocorrências correspondentes. O histórico mantém até quinze palavras únicas.

## Observações

- A pronúncia usa `window.speechSynthesis`; as vozes disponíveis variam por dispositivo.
- Traduções são geradas pela IA e podem exigir ajustes em casos ambíguos.
- Para evitar abuso de custos em produção pública, considere adicionar rate limiting e autenticação caso o app cresça.
