# Tirinhas em Inglês

Aplicação educacional com Next.js App Router, TypeScript, Tailwind CSS, OpenAI API, armazenamento local no navegador e síntese de voz do próprio dispositivo.

## Requisitos

- Node.js 20.9+ (recomendado Node.js 22)
- Uma chave da OpenAI API: https://platform.openai.com/api-keys
- Uma forma de pagamento/créditos habilitados na plataforma da API, conforme o uso da conta

> A assinatura do ChatGPT não inclui créditos da API. O uso da API é cobrado separadamente, de acordo com o modelo e a quantidade de tokens.

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
OPENAI_API_KEY=sua_chave_real
```

Nunca use `NEXT_PUBLIC_` no nome dessa variável. A chave deve permanecer no servidor e nunca deve ser enviada ao navegador ou publicada no GitHub.

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

1. Abra o projeto na Vercel.
2. Acesse **Settings → Environment Variables**.
3. Crie a variável `OPENAI_API_KEY` com sua chave da OpenAI.
4. Marque os ambientes em que pretende usar o app (Production, Preview e/ou Development).
5. Salve e faça um novo deploy.

Se ainda existir a variável antiga `GEMINI_API_KEY`, ela não é mais utilizada e pode ser removida depois que a migração estiver publicada.

## Geração das tirinhas

A rota `/api/gerar` utiliza a OpenAI Responses API com o modelo `gpt-5.4-mini` e Structured Outputs para solicitar uma resposta em JSON seguindo o formato da aplicação. O servidor também valida o resultado com Zod antes de enviá-lo ao navegador.

Cada tirinha contém exatamente quatro quadros. O nível simples usa inglês A1-A2 e o nível médio usa inglês A2-B1.

## Repetição espaçada

A cada geração, o navegador envia até cinco palavras do histórico para `/api/gerar`. A IA tenta reutilizá-las naturalmente e o servidor marca as ocorrências correspondentes. O histórico mantém até quinze palavras únicas.

## Pronúncia e armazenamento

- A pronúncia usa `window.speechSynthesis`; as vozes disponíveis variam por dispositivo.
- O histórico de vocabulário fica no `localStorage` e é específico daquele navegador/dispositivo.
- Traduções são geradas pela IA e podem exigir ajustes em casos ambíguos.

## Custos e proteção

O modelo `gpt-5.4-mini` é uma opção mais rápida e econômica para geração frequente de conteúdo estruturado. Cada geração consome tokens da sua conta da OpenAI.

Para evitar abuso de custos em produção pública, considere adicionar rate limiting, autenticação e limites de uso por usuário caso o app cresça.
