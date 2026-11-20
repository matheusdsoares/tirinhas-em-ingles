# Tirinhas em Inglês

Aplicação educacional com Next.js App Router, TypeScript, Tailwind CSS, OpenAI API e armazenamento local no navegador.

## Requisitos

- Node.js 20.9+ (recomendado Node.js 22)
- Chave da OpenAI API: https://platform.openai.com/api-keys
- A API é cobrada separadamente da assinatura do ChatGPT.

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

1. Em **Settings → Environment Variables**, crie `OPENAI_API_KEY`.
2. Marque os ambientes nos quais pretende usar o app (Production e Preview; Development se também usar o ambiente local pela Vercel).
3. Faça um novo deploy após salvar a variável, pois alterações de variáveis só passam a valer em novos deployments.

## Repetição espaçada

A cada geração, o navegador envia até cinco palavras do histórico para `/api/gerar`. A IA tenta reutilizá-las naturalmente e o servidor marca as ocorrências correspondentes. O histórico mantém até quinze palavras únicas.

## Observações

- A pronúncia usa `window.speechSynthesis`; as vozes disponíveis variam por dispositivo.
- Traduções são geradas pela IA e podem exigir ajustes em casos ambíguos.
- Para evitar abuso de custos em produção pública, considere adicionar rate limiting e autenticação caso o app cresça.
