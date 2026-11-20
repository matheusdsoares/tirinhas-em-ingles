# Tirinhas em Inglês

Aplicação educacional com Next.js App Router, TypeScript, Tailwind CSS, Gemini API e armazenamento local no navegador.

## Requisitos

- Node.js 20.9+ (recomendado Node.js 22)
- Chave gratuita da Gemini API: https://aistudio.google.com/apikey

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

Nunca use `NEXT_PUBLIC_` no nome dessa variável. A chave deve permanecer no servidor e nunca deve ser enviada ao navegador ou commitada no Git.

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

1. Em **Settings → Environment Variables**, crie `GEMINI_API_KEY`.
2. Marque **Production** (e Preview/Development se também for usar nesses ambientes).
3. Faça um novo deploy após salvar a variável, pois alterações de variáveis só passam a valer em novos deployments.

A aplicação usa `gemini-3.8-flash`, que consta como disponível no nível gratuito da Gemini Developer API na página oficial de preços. O nível gratuito tem limites de uso que podem mudar e a disponibilidade deve ser conferida no painel do Google AI Studio. Não configure faturamento se quiser permanecer no nível gratuito.

## Funcionalidades

- Tirinhas com exatamente quatro quadros em situações cotidianas.
- Níveis simples (A1-A2) e médio (A2-B1).
- Tradução contextual palavra por palavra e tradução livre por quadro.
- Reciclagem de até cinco palavras anteriores em cada nova história.
- Histórico local de até quinze palavras únicas.
- Pronúncia usando `window.speechSynthesis`; as vozes disponíveis variam por dispositivo.

## Privacidade e limites

No nível gratuito, o Google informa que o conteúdo enviado pode ser usado para melhorar os produtos. Consulte os termos e limites oficiais antes de usar dados pessoais ou conteúdo sensível. O serviço pode retornar erro 429 quando a cota gratuita for atingida.
