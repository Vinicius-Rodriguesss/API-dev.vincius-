# LinkedIn API

API em Node.js + TypeScript para:

- gerar conteudo com Gemini
- salvar prompts no PostgreSQL com Prisma
- publicar no LinkedIn
- expor endpoints para o portfolio

## Stack

- Node.js
- TypeScript
- Express
- Prisma
- PostgreSQL
- Docker

## Estrutura

- `src/` rotas, controllers, services HTTP e middleware
- `service/IA/` geracao de conteudo com IA
- `service/Linkedin/` autenticacao, publicacao e historico
- `service/Prompt/` leitura e parse dos prompts salvos
- `service/postSchedule/` agendamento da geracao
- `service/LinkedinScheduler/` agendamento e publicacao inicial
- `prisma/` schema e migrations
- `lib/` conexao com Prisma

## Variaveis de ambiente

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL="postgresql://usuario:senha@host:5432/banco"
GEMINI_API_KEY="sua_chave_gemini"
NEWS_API_KEY="sua_chave_news_api"
PORT=5001

LINKEDIN_CLIENT_ID="seu_client_id"
LINKEDIN_CLIENT_SECRET="seu_client_secret"
LINKEDIN_REDIRECT_URI="http://localhost:5000/callback"
LINKEDIN_PUBLISH_ON_STARTUP="true"
```

## Como rodar localmente

```bash
npm install
npm run typecheck
npm run dev
```

API local:

```bash
http://localhost:5001
```

## Como subir no servidor

Essa API foi pensada para rodar em servidor Node tradicional, VPS, VM ou Docker.

### Opcao 1. Servidor com Node

#### 1. Instale as dependencias

```bash
npm install
```

#### 2. Gere o build completo

```bash
npm run build
```

#### 3. Suba a API

```bash
npm run start
```

O `start` executa:

```bash
node dist/src/server.js
```

Observacao:

- o projeto usa `prestart`, entao o TypeScript recompila antes de iniciar

### Opcao 2. Servidor com PM2

#### 1. Instale o PM2

```bash
npm install -g pm2
```

#### 2. Instale dependencias

```bash
npm install
```

#### 3. Gere o build

```bash
npm run build
```

#### 4. Suba a API

```bash
pm2 start npm --name linkedin-api -- run start
```

#### 5. Salve a configuracao

```bash
pm2 save
pm2 startup
```

### Opcao 3. Docker

#### 1. Configure o `.env`

Preencha todas as variaveis antes do build.

#### 2. Gere a imagem

```bash
docker build -t linkedin-api .
```

#### 3. Rode o container

```bash
docker run -d --name linkedin-api -p 5001:5001 --env-file .env linkedin-api
```

### Opcao 4. docker compose

O projeto possui `docker-compose.yml` para subir a API:

```bash
docker compose up -d --build
```

Para parar:

```bash
docker compose down
```

## Como validar se subiu

Use o healthcheck:

```bash
curl http://localhost:5001/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

## Endpoints

### Health

```http
GET /health
```

### Prompts

Lista todos os prompts salvos:

```http
GET /prompts
```

Busca o ultimo prompt salvo:

```http
GET /prompts/latest
```

### Portfolio

Lista os posts prontos para consumo:

```http
GET /portfolio/posts
```

Busca o ultimo post pronto:

```http
GET /portfolio/posts/latest
```

## Comportamento da aplicacao

Quando a API sobe:

- inicia o Express
- sobe o endpoint `/health`
- registra o agendamento da IA
- registra o agendamento do LinkedIn
- gera e publica um novo post ao iniciar, se `LINKEDIN_PUBLISH_ON_STARTUP="true"`

Agendamentos atuais:

- IA gera e salva: `09:55` de segunda-feira
- LinkedIn publica: `10:00` de segunda-feira
- timezone: `America/Sao_Paulo`

## Observacoes importantes

### 1. O LinkedIn usa arquivos locais

Os arquivos abaixo guardam estado local:

- `linkedin-token.json`
- `linkedin-post-history.json`

Se o servidor perder esses arquivos, o fluxo de publicacao pode exigir nova autenticacao.

### 2. O build depende do Prisma

O comando abaixo executa Prisma + compilacao TypeScript:

```bash
npm run build
```

Hoje ele roda:

```bash
prisma generate && tsc
```

### 3. Nao e um projeto serverless-first

Essa API usa cron dentro da aplicacao e estado local para a parte do LinkedIn.

Os ambientes mais indicados sao:

- VPS
- VM
- Docker
- servidor Node tradicional

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```
